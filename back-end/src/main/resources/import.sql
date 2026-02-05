INSERT INTO RawMaterial (id, name, stockQuantity) VALUES (1, 'Madeira', 100);
INSERT INTO RawMaterial (id, name, stockQuantity) VALUES (2, 'Prego', 500);
INSERT INTO RawMaterial (id, name, stockQuantity) VALUES (3, 'Verniz', 20);

INSERT INTO Product (id, name, price) VALUES (1, 'Mesa de Luxo', 500.0);
INSERT INTO Product (id, name, price) VALUES (2, 'Cadeira Simples', 100.0);

INSERT INTO ProductComposition (id, product_id, rawMaterial_id, quantityRequired) VALUES (1, 1, 1, 10);
INSERT INTO ProductComposition (id, product_id, rawMaterial_id, quantityRequired) VALUES (2, 1, 3, 2);
INSERT INTO ProductComposition (id, product_id, rawMaterial_id, quantityRequired) VALUES (3, 2, 1, 2);
INSERT INTO ProductComposition (id, product_id, rawMaterial_id, quantityRequired) VALUES (4, 2, 2, 10);