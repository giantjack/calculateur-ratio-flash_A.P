# Calculateur Ratio Flash/Ambiance

## Description
Outil interactif pour comprendre et calculer le ratio entre lumière flash et lumière ambiante. Essentiel pour les photographes qui utilisent le flash en complément de la lumière naturelle.

## Stack technique
- Vite + React + TypeScript
- Chakra UI pour les composants
- Déploiement GitHub Pages via GitHub Actions

## Concept
Le ratio flash/ambiance exprime la proportion de lumière venant du flash vs la lumière naturelle :

| Ratio | Stops | Effet |
|-------|-------|-------|
| 1:4 | -2 | Fill très léger, débouchage subtil |
| 1:2 | -1 | Fill naturel, portrait extérieur |
| 1:1 | 0 | Équilibre parfait |
| 2:1 | +1 | Flash légèrement dominant |
| 4:1 | +2 | Flash marqué, dramatique |
| 8:1 | +3 | Flash très dominant, fond sombre |

## Structure
```
src/
  App.tsx      # Composant principal avec calculateur
  main.tsx     # Point d'entrée React
```

## Fonctionnalités
- Slider pour ajuster le ratio (-3 à +4 stops)
- Affichage du ratio formaté (2:1, 1:1, 1:2, etc.)
- Visualisation graphique de la répartition de lumière
- Aperçu visuel de l'effet sur un sujet
- Tableau des ratios courants cliquables
- Conseils pour ajuster le ratio (ouverture, vitesse, puissance flash)
- Explications pédagogiques

## Commandes
```bash
npm install    # Installer les dépendances
npm run dev    # Serveur de développement
npm run build  # Build production
```

## Déploiement
Push sur `main` → GitHub Actions → GitHub Pages
URL: https://giantjack.github.io/calculateur-ratio-flash_A.P/
