# Admin Dashboard - Documentation

## Vue d'ensemble

Le dashboard admin permet aux administrateurs de visualiser, trier et filtrer toutes les commandes de l'application de commande de pizza.

## Accès à la Page Admin

### URL
```
http://localhost:3000/admin.html
```

### Authentification
- **Mot de passe par défaut** : `admin123`
- L'authentification est stockée dans `sessionStorage` pendant la session du navigateur
- Cliquez sur "Logout" pour vous déconnecter

⚠️ **Note de Sécurité** : Dans un environnement de production, l'authentification devrait être gérée côté serveur avec des tokens JWT, bcrypt pour les mots de passe, et une véritable gestion des utilisateurs.

## Fonctionnalités

### 1. Tableau des Commandes
Le tableau affiche les informations suivantes pour chaque commande :
- **Order ID** : Identifiant unique de la commande
- **Date & Time** : Date et heure de création de la commande
- **Customer Address** : Adresse de livraison (tronquée dans le tableau)
- **Pizza** : Nom de la pizza de base commandée
- **Toppings** : Liste des garnitures (base + extras)
- **Total Price** : Prix total incluant la livraison
- **Status** : Statut de la commande (Pending/Confirmed)
- **Actions** : Bouton pour voir les détails complets

### 2. Filtrage
Filtrez les commandes par statut :
- **All Orders** : Toutes les commandes
- **Pending** : Commandes en attente de confirmation
- **Confirmed** : Commandes confirmées et payées

### 3. Tri
Triez les commandes selon différents critères :
- **Date (Newest First)** : Commandes les plus récentes en premier
- **Date (Oldest First)** : Commandes les plus anciennes en premier
- **Price (High to Low)** : Prix décroissant
- **Price (Low to High)** : Prix croissant
- **Order ID** : Par identifiant de commande
- **Status** : Par statut

### 4. Statistiques
Quatre indicateurs clés affichés en haut :
- **Total Orders** : Nombre total de commandes
- **Pending** : Nombre de commandes en attente
- **Confirmed** : Nombre de commandes confirmées
- **Total Revenue** : Revenu total des commandes confirmées

### 5. Détails de Commande
Cliquez sur "👁️ View Details" pour afficher une modale avec :
- Informations complètes de la commande
- Pizza commandée avec garnitures de base et extras
- Adresse complète de livraison
- Détail des prix (pizza + frais de livraison)
- Date et heure complètes

### 6. Actualisation
Cliquez sur le bouton "🔄 Refresh" pour recharger les commandes depuis le serveur.

## API Backend

### Endpoint : GET /api/orders

Récupère toutes les commandes avec support de tri et filtrage.

**Paramètres de requête** :
- `sortBy` : Champ de tri (`id`, `createdAt`, `totalPrice`, `status`)
- `sortOrder` : Ordre de tri (`ASC`, `DESC`)
- `status` : Filtre par statut (`all`, `pending`, `confirmed`)

**Exemple** :
```
GET /api/orders?sortBy=createdAt&sortOrder=DESC&status=confirmed
```

**Réponse** :
```json
[
  {
    "id": 1,
    "basePizzaId": 2,
    "toppings": [1, 2, 3],
    "address": "123 Main St, Apt 4B",
    "pizzaPrice": "12.00",
    "deliveryFee": "5.00",
    "totalPrice": "17.00",
    "status": "confirmed",
    "createdAt": "2025-10-28T10:30:00.000Z",
    "updatedAt": "2025-10-28T10:35:00.000Z"
  }
]
```

## Architecture des Fichiers

### Frontend
- **admin.html** : Structure HTML de la page admin
- **admin.js** : Logique JavaScript (authentification, chargement des commandes, tri, filtrage)
- **admin.css** : Styles CSS cohérents avec l'application principale

### Backend
- **routes/orders.js** : 
  - Nouveau endpoint `GET /api/orders` ajouté en haut du fichier
  - Support du tri et filtrage via paramètres de requête
  - Utilise Sequelize pour les requêtes SQL sécurisées

## Design & UX

### Cohérence Visuelle
- Utilise les mêmes gradients que l'application principale
- Palette de couleurs harmonisée
- Badges de statut colorés (jaune pour pending, vert pour confirmed)
- Design responsive pour mobile, tablette et desktop

### Responsive Design
- **Desktop** : Tableau complet avec toutes les colonnes
- **Tablette** : Adaptation des colonnes et grilles
- **Mobile** : Scroll horizontal pour le tableau, statistiques empilées

## Améliorations Futures

### Sécurité
1. Authentification serveur avec JWT
2. Hachage des mots de passe avec bcrypt
3. Rate limiting pour prévenir les attaques par force brute
4. HTTPS obligatoire
5. Protection CSRF

### Fonctionnalités
1. Modification du statut des commandes
2. Recherche par adresse ou ID
3. Export des données (CSV, PDF)
4. Graphiques et analytics
5. Notifications en temps réel
6. Pagination pour grandes listes

### UI/UX
1. Dark mode
2. Personnalisation de l'affichage des colonnes
3. Sauvegarde des préférences de tri/filtrage
4. Impression de commandes
5. Envoi d'emails de confirmation

## Critères d'Acceptation - Vérification

✅ **CA1** : Les admins peuvent accéder à la liste des commandes via un lien dans le header + URL directe  
✅ **CA2** : Les commandes sont récupérées depuis le backend via l'API et affichées dans un tableau  
✅ **CA3** : Les admins peuvent trier (6 options) et filtrer (par statut) la liste des commandes  
✅ **CA4** : Chaque ligne de commande inclut un bouton "View Details" pour voir les détails complets  
✅ **Bonus** : Authentification par mot de passe  
✅ **Bonus** : Statistiques en temps réel  
✅ **Bonus** : Interface responsive et moderne  

## Support

Pour toute question ou problème :
1. Vérifiez que le serveur est bien démarré (`npm start`)
2. Vérifiez les logs du serveur dans la console
3. Utilisez les outils de développement du navigateur (F12) pour voir les erreurs JavaScript
4. Vérifiez que la base de données SQLite est bien créée et contient des commandes

## Licence

ISC
