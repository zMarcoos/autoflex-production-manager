package com.autoflex;

import io.quarkus.panache.common.Sort;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class ProductionService {

  @Transactional
  public List<ProductionPlanItem> calculateProductionPlan() {
    List<Product> productsSortedByPrice = Product.listAll(Sort.descending("price"));

    List<RawMaterial> allRawMaterials = RawMaterial.listAll();

    Map<Long, Integer> availableStockMap = new HashMap<>();
    for (RawMaterial rawMaterial : allRawMaterials) {
      availableStockMap.put(rawMaterial.id, rawMaterial.stockQuantity);
    }

    List<ProductionPlanItem> productionPlanList = new ArrayList<>();

    for (Product product : productsSortedByPrice) {
      if (product.compositions == null || product.compositions.isEmpty()) continue;

      int maximumUnitsProducible = Integer.MAX_VALUE;

      for (ProductComposition productComposition : product.compositions) {
        Long rawMaterialId = productComposition.rawMaterial.id;
        int quantityRequiredPerUnit = productComposition.quantityRequired;

        int currentAvailableStock = availableStockMap.getOrDefault(rawMaterialId, 0);

        if (quantityRequiredPerUnit > 0) {
          int possibleUnitsWithThisMaterial = currentAvailableStock / quantityRequiredPerUnit;

          if (possibleUnitsWithThisMaterial < maximumUnitsProducible) {
            maximumUnitsProducible = possibleUnitsWithThisMaterial;
          }
        }
      }

      if (maximumUnitsProducible > 0 && maximumUnitsProducible != Integer.MAX_VALUE) {

        for (ProductComposition productComposition : product.compositions) {
          Long rawMaterialId = productComposition.rawMaterial.id;
          int quantityRequiredPerUnit = productComposition.quantityRequired;

          int totalQuantityToDeduct = quantityRequiredPerUnit * maximumUnitsProducible;
          int currentQuantity = availableStockMap.get(rawMaterialId);

          availableStockMap.put(rawMaterialId, currentQuantity - totalQuantityToDeduct);
        }

        productionPlanList.add(new ProductionPlanItem(
          product.name,
          maximumUnitsProducible,
          maximumUnitsProducible * product.price
        ));
      }
    }

    return productionPlanList;
  }

  public record ProductionPlanItem(String productName, int quantityProduced, double totalEstimatedValue) {}
}