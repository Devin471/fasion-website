# Quick Template - Add Animations to Your Pages

## Template 1: Simple Page with Scroll Reveals

```jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ScrollReveal } from '../components/AnimationComponents';

export default function MyPage() {
  return (
    <div>
      {/* Hero Section */}
      <motion.section
        className="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Page Title
        </motion.h1>
      </motion.section>

      {/* Content Sections */}
      <ScrollReveal delay={0.1}>
        <section className="content">Content Here</section>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <section className="content">More Content</section>
      </ScrollReveal>
    </div>
  );
}
```

---

## Template 2: Product Grid Page

```jsx
import { AnimatedProductGrid, AnimatedSection } from '../components/AnimatedListComponents';
import ProductCard from '../components/ProductCard';

export default function ShopPage() {
  return (
    <div>
      <AnimatedSection>
        <h1>Shop Products</h1>
        <p>Browse our collection</p>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <AnimatedProductGrid
          products={products}
          renderProduct={(product) => (
            <ProductCard key={product._id} product={product} />
          )}
        />
      </AnimatedSection>
    </div>
  );
}
```

---

## Template 3: Form Page with Input Animations

```jsx
import { motion } from 'framer-motion';

export default function FormPage() {
  const [data, setData] = React.useState({});

  return (
    <motion.form
      className="form"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label>Email</label>
        <input
          type="email"
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label>Password</label>
        <input
          type="password"
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
      </motion.div>

      <motion.button
        type="submit"
        className="btn btn-primary"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ delay: 0.3 }}
      >
        Submit
      </motion.button>
    </motion.form>
  );
}
```

---

## Template 4: Modal/Dialog with Animations

```jsx
import { AnimatePresence, motion } from 'framer-motion';

export default function Modal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="modal"
            initial={{ opacity: 0, scale: 0.9, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -50 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
          >
            <h2>Modal Title</h2>
            <p>Modal content goes here</p>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Close
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

---

## Template 5: Tabs with Animated Content

```jsx
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

export default function Tabs() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: 'Tab 1', content: 'Content 1' },
    { label: 'Tab 2', content: 'Content 2' },
    { label: 'Tab 3', content: 'Content 3' },
  ];

  return (
    <div>
      {/* Tab Buttons */}
      <div className="tab-buttons">
        {tabs.map((tab, idx) => (
          <motion.button
            key={idx}
            onClick={() => setActiveTab(idx)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={activeTab === idx ? 'active' : ''}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.3 }}
        >
          {tabs[activeTab].content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
```

---

## Common Animation Patterns

### Staggered List Items
```jsx
<motion.ul>
  {items.map((item, idx) => (
    <motion.li
      key={idx}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.1 }}
      viewport={{ once: true }}
    >
      {item.name}
    </motion.li>
  ))}
</motion.ul>
```

### Counter Animation
```jsx
import { useCountUp } from '../hooks/useAnimations';

export default function Counter() {
  const count = useCountUp(100, 2); // Count to 100 in 2 seconds
  return <div>{count}</div>;
}
```

### Parallax on Scroll
```jsx
import { Parallax } from '../components/AnimationComponents';

<Parallax offset={50}>
  <img src="image.jpg" alt="parallax" />
</Parallax>
```

---

## Tips for Best Results

1. **Keep animations subtle** - 300-500ms duration is ideal
2. **Use spring physics** - Feels more natural than ease
3. **Group animations** - Stagger for visual interest
4. **Test on mobile** - Reduce motion on slower devices
5. **Consider accessibility** - Respect `prefers-reduced-motion`

---

## Performance Notes

- Framer Motion uses `transform` and `opacity` (GPU-accelerated)
- Avoid animating `width`, `height`, `left`, `top`
- Use `will-change: transform` for complex animations
- Profile with Chrome DevTools Performance tab

---

## Need Help?

Check existing animated pages:
- ✅ Home.js - Full example with scroll reveals
- ✅ ProductCard.js - Interaction animations
- ✅ Navbar.js - Menu and dropdown animations
