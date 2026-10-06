Renders the supplied Ocard artwork as vector SVG. Pass `assetBase` pointing at the copied `assets/` folder.

```jsx
<Logo height={28} assetBase="../../assets" />                       {/* Ocard, horizontal, on light */}
<Logo brand="ofb" orientation="vertical" onDark height={64} />      {/* Ocard for Business, reversed */}
<Logo variant="mark" height={32} />                                 {/* hexagon only */}
```

The two brands share one hexagon silhouette but different interiors: **Ocard** = an ink #333333 tilted membership card; **Ocard for Business** = a white cube at 100% / 75% / 50% opacity over the yellow hexagon (keep the opacities — do not flatten). Clear space ≥ the mark's own height on every side. Minimum height 20px horizontal, 32px vertical.
