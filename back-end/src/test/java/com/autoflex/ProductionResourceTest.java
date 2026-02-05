package com.autoflex;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;

@QuarkusTest
class ProductionResourceTest {

  @Test
  void testListProductsEndpoint() {
    given()
      .when().get("/api/products")
      .then()
      .statusCode(200)
      .body("size()", greaterThanOrEqualTo(0));
  }

  @Test
  void testListMaterialsEndpoint() {
    given()
      .when().get("/api/materials")
      .then()
      .statusCode(200)
      .body("size()", greaterThanOrEqualTo(0));
  }

  @Test
  void testProductionPlanEndpoint() {
    given()
      .when().get("/api/plan")
      .then()
      .statusCode(200)
      .body("size()", greaterThanOrEqualTo(0));
  }

  @Test
  void testCreateMaterialEndpoint() {
    RawMaterial newMaterial = new RawMaterial();
    newMaterial.name = "Test Material";
    newMaterial.stockQuantity = 50;

    given()
      .contentType("application/json")
      .body(newMaterial)
      .when().post("/api/materials")
      .then()
      .statusCode(201)
      .body("name", is("Test Material"));
  }
}