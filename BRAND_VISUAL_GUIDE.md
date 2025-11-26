# ReshapeX Brand Visual Guide

## 🎨 Color Palette

### Background Colors
```
Deep Space:  #0D1117  ████  Main background
Slate:       #1C2128  ████  Card backgrounds
```

### Accent Colors
```
Electric Green: #73B400  ████  Primary CTA
Cyber Blue:     #00D9FF  ████  Secondary accent
Volt Yellow:    #FFE500  ████  Highlights
Hot Magenta:    #FF006E  ████  Emphasis
Neon Coral:     #FF4D6D  ████  Warm accent
```

### Text Colors
```
White:       #FFFFFF  ████  Primary text
Steel Gray:  #8B9AAD  ████  Secondary text
```

## 🌈 Gradient Combinations

### Primary Gradients
1. **Green → Yellow** `linear-gradient(135deg, #73B400, #FFE500)`
   - Usage: Logo, Hot leads, Primary actions
   
2. **Green → Blue** `linear-gradient(135deg, #73B400, #00D9FF)`
   - Usage: Page titles, High leads
   
3. **Blue → Coral** `linear-gradient(135deg, #00D9FF, #FF4D6D)`
   - Usage: Medium leads, Feature highlights
   
4. **Magenta → Green** `linear-gradient(135deg, #FF006E, #73B400)`
   - Usage: Special actions, Icons
   
5. **Blue → White** `linear-gradient(135deg, #00D9FF, #FFFFFF)`
   - Usage: Low leads, Subtle highlights

## 📝 Typography Scale

### Headings
- **H1**: 48-60px, Font Weight 900 (Black)
- **H2**: 36-48px, Font Weight 800 (Extra Bold)
- **H3**: 24-32px, Font Weight 700 (Bold)
- **H4**: 20-24px, Font Weight 700 (Bold)

### Body Text
- **Large**: 18-20px, Font Weight 600 (Semibold)
- **Regular**: 16px, Font Weight 400 (Regular)
- **Small**: 14px, Font Weight 400 (Regular)
- **Tiny**: 12px, Font Weight 600 (Semibold)

### Special Text
- **Buttons**: Uppercase, Letter-spacing 0.5px, Weight 700
- **Labels**: Uppercase, Letter-spacing 1-2px, Weight 600
- **Logo**: Uppercase, Letter-spacing 2px, Weight 900

## 🎯 Component Examples

### Button Styles

**Primary Button**
- Background: Electric Green (#73B400)
- Text: Deep Space (#0D1117)
- Hover: Darker green + lift effect
- Font: Bold, Uppercase

**Secondary Button**
- Background: Transparent
- Border: Steel Gray (#8B9AAD)
- Text: Steel Gray
- Hover: Green border + text

### Card Styles

**Default Card**
- Background: Slate (#1C2128)
- Border: 1px rgba(139,154,173,0.15)
- Hover: Green border (#73B400)

**Score Card**
- Background: Slate
- Border: 2px rgba(115,180,0,0.3)
- Inner elements with gradients

### Input Fields

**Text Input**
- Background: Deep Space (#0D1117)
- Border: rgba(139,154,173,0.3)
- Text: White (#FFFFFF)
- Placeholder: Steel Gray (#8B9AAD)
- Focus: Green border (#73B400)

### Progress Bar

**Structure**
- Track: rgba(139,154,173,0.2)
- Fill: Green → Blue gradient
- Height: 8px
- Border radius: 4px

## 🎭 Score Band Styling

### Hot Lead (80-100)
- Badge: Green → Yellow gradient
- Border: Bright green glow
- Icon: Gold award with rotation

### High Lead (60-79)
- Badge: Green → Blue gradient
- Border: Blue-green mix
- Icon: Blue accent

### Medium Lead (40-59)
- Badge: Blue → Coral gradient
- Border: Coral accent
- Icon: Coral/pink

### Low Lead (0-39)
- Badge: Blue → White gradient
- Border: Subtle blue
- Icon: Light blue

## ✨ Hover Effects

### Cards
```css
Default: border-color: rgba(139,154,173,0.15)
Hover:   border-color: #73B400
         transition: all 0.3s ease
```

### Buttons
```css
Default: transform: translateY(0)
Hover:   transform: translateY(-2px)
         box-shadow: 0 8px 20px rgba(115,180,0,0.3)
```

### Icons
```css
Default: scale(1)
Hover:   scale(1.1)
         transition: transform 0.3s ease
```

## 🔧 CSS Classes Reference

### Brand Classes
- `.rx-theme` - Apply overall theme
- `.rx-bg-deep-space` - Deep Space background
- `.rx-bg-slate` - Slate background
- `.rx-text-steel` - Steel Gray text
- `.rx-text-green` - Electric Green text
- `.rx-text-blue` - Cyber Blue text

### Gradient Classes
- `.rx-gradient-text` - Gradient text utility
- `.rx-gc-green-yellow` - Green to Yellow gradient
- `.rx-gc-green-blue` - Green to Blue gradient
- `.rx-gc-blue-coral` - Blue to Coral gradient
- `.rx-gc-magenta-green` - Magenta to Green gradient
- `.rx-gc-blue-white` - Blue to White gradient

### Component Classes
- `.rx-card` - Card component
- `.rx-btn-primary` - Primary button
- `.rx-btn-secondary` - Secondary button
- `.rx-progress` - Progress bar track
- `.rx-progress-fill` - Progress bar fill
- `.rx-score-badge` - Score badge wrapper

### Effect Classes
- `.rx-glow-green` - Green glow shadow
- `.rx-glow-blue` - Blue glow shadow
- `.rx-animated-gradient` - Animated gradient background

## 📱 Responsive Breakpoints

```css
/* Mobile First */
Base:     < 640px
sm:       >= 640px
md:       >= 768px
lg:       >= 1024px
xl:       >= 1280px
```

## 🎨 Usage Examples

### Hero Title
```html
<h1 class="text-5xl font-black">
  <span class="rx-gradient-text rx-gc-green-blue">
    ReshapeX
  </span>
</h1>
```

### Feature Card
```html
<div class="rx-card p-8 hover:border-[#73B400]">
  <div class="rx-gradient-text rx-gc-green-yellow">
    Icon Here
  </div>
  <h3 class="text-white font-bold">Title</h3>
  <p class="rx-text-steel">Description</p>
</div>
```

### Score Display
```html
<div class="rx-score-badge">
  <div class="rx-score-badge-inner">
    <span class="text-4xl text-white">85</span>
    <span class="rx-text-steel">/ 100</span>
  </div>
</div>
```

---

**Quick Reference**: All ReshapeX brand assets are consistently applied throughout the AI Readiness Assessment app for a cohesive, professional appearance.
