package com.autoflex;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductionResource {

  @Inject
  ProductionService productionService;

  @GET
  @Path("/materials")
  public List<RawMaterial> listRawMaterials() {
    return RawMaterial.listAll();
  }

  @POST
  @Path("/materials")
  @Transactional
  public Response createRawMaterial(RawMaterial rawMaterial) {
    rawMaterial.persist();
    return Response.status(201).entity(rawMaterial).build();
  }

  @GET
  @Path("/products")
  public List<Product> listProducts() {
    return Product.listAll();
  }

  @POST
  @Path("/products")
  @Transactional
  public Response createProduct(Product product) {
    product.persist();
    return Response.status(201).entity(product).build();
  }

  @GET
  @Path("/plan")
  public List<ProductionService.ProductionPlanItem> getProductionPlan() {
    return productionService.calculateProductionPlan();
  }
}