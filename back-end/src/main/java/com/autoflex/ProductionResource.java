package com.autoflex;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductionResource {

  @Inject
  ProductionService service;

  @GET
  @Path("/materials")
  public List<RawMaterial> listMaterials() {
    return RawMaterial.listAll();
  }

  @POST
  @Path("/materials")
  @Transactional
  public Response createMaterial(RawMaterial material) {
    material.persist();
    return Response.status(201).entity(material).build();
  }

  @GET
  @Path("/products")
  public List<Product> listProducts() {
    return Product.listAll();
  }

  @GET
  @Path("/plan")
  public Response getProductionPlan() {
    return Response.ok(service.calculateProductionPlan()).build();
  }
}