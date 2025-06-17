import json
import random
from typing import List, Dict

SHOPS = ["Nantes", "Paris", "Saint-herblain"]

def generate_product_data(product_code: str, shop: str) -> List[Dict]:
    data = []
    for week in range(1, 53):
        # Générer le type selon les probabilités demandées
        type_rand = random.random()
        if type_rand < 0.5:
            product_type = None
        elif type_rand < 0.7:
            product_type = "20/80"
        elif type_rand < 0.85:
            product_type = "promo"
        else:
            product_type = "sensible"

        # Générer les ventes avec une variation selon le magasin
        base_sold = random.randint(0, 100)
        # Paris a tendance à avoir plus de ventes
        if shop == "Paris":
            sold = min(100, int(base_sold * 1.2))
        # Saint-herblain a tendance à avoir moins de ventes
        elif shop == "Saint-herblain":
            sold = max(0, int(base_sold * 0.8))
        else:
            sold = base_sold
        
        # Calculer le CA en fonction des ventes (avec une marge d'erreur)
        base_ca = sold * 10  # Base de 10€ par unité
        ca = min(1000, max(0, base_ca + random.randint(-100, 100)))
        
        # Générer les autres métriques
        shrinkage = random.randint(0, 50)
        gross_margin = random.randint(5, 50)
        net_margin = min(gross_margin, random.randint(5, 50))
        stock = random.randint(0, 100)
        flow = random.randint(50, 400)

        entry = {
            "salesCode": product_code,
            "shop": shop,
            "type": product_type,
            "sold": sold,
            "week": week,
            "ca": ca,
            "shrinkage": shrinkage,
            "grossMargin": gross_margin,
            "netMargin": net_margin,
            "stock": stock,
            "flow": flow
        }
        data.append(entry)
    return data

def main():
    all_data = []
    
    # Générer les données pour 50 produits dans chaque magasin
    for i in range(1, 51):
        product_code = f"FRUIT-{i:03d}"
        for shop in SHOPS:
            product_data = generate_product_data(product_code, shop)
            all_data.extend(product_data)
    
    # Écrire dans le fichier JSON
    with open('fixtures/fixtures.json', 'w') as f:
        json.dump(all_data, f, indent=2)

if __name__ == "__main__":
    main() 