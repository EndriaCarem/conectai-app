// Fundo "constelação de conexões" — rede de pontos e linhas luminosas.
// Animações: react-native-reanimated (v4) + react-native-svg.
// Geometria determinística (seeded): mesma cena em todos os renders.

import { useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Line, RadialGradient, Stop } from 'react-native-svg';

type ConstellationProps = {
  density?: number;
  style?: StyleProp<ViewStyle>;
};

type Node = { x: number; y: number; r: number };

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function random(seed: number) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function PulsingNode({ node, phase }: { node: Node; phase: number }) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withDelay(
      phase * 620,
      withRepeat(
        withTiming(1, { duration: 3400, easing: Easing.inOut(Easing.quad) }),
        -1,
        true,
      ),
    );
  }, [phase, pulse]);

  const glow = useAnimatedProps(() => ({
    r: node.r * (2.1 + pulse.value * 1.5),
    opacity: 0.34 - pulse.value * 0.18,
  }));

  return (
    <>
      <AnimatedCircle
        cx={node.x}
        cy={node.y}
        fill="url(#nodeGlow)"
        animatedProps={glow}
      />
      <Circle cx={node.x} cy={node.y} r={node.r} fill="url(#nodeCore)" />
    </>
  );
}

export default function Constellation({ density = 18, style }: ConstellationProps) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const breath = useSharedValue(0);

  useEffect(() => {
    breath.value = withRepeat(
      withTiming(1, { duration: 5600, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [breath]);

  const breathStyle = useAnimatedStyle(() => ({
    opacity: 0.55 + breath.value * 0.45,
  }));

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (
      width > 0 &&
      height > 0 &&
      (Math.abs(width - size.width) > 2 || Math.abs(height - size.height) > 2)
    ) {
      setSize({ width, height });
    }
  };

  const geometry = useMemo(() => {
    const { width, height } = size;
    if (width === 0 || height === 0) return null;

    const margin = 30;
    const nodes: Node[] = Array.from({ length: density }, (_, i) => ({
      x: margin + random(i * 4 + 1) * (width - margin * 2),
      y: margin + random(i * 4 + 2) * (height - margin * 2),
      r: 1.6 + random(i * 4 + 3) * 1.9,
    }));

    const edges: { a: Node; b: Node }[] = [];
    const seen = new Set<string>();

    for (let i = 1; i < nodes.length; i += 1) {
      let nearest = -1;
      let nearestDist = Number.POSITIVE_INFINITY;

      for (let j = 0; j < i; j += 1) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = dx * dx + dy * dy;
        if (dist < nearestDist) {
          nearestDist = dist;
          nearest = j;
        }
      }

      if (nearest >= 0) {
        const key = `${i}-${nearest}`;
        if (!seen.has(key)) {
          seen.add(key);
          edges.push({ a: nodes[i], b: nodes[nearest] });
        }
      }

      if (i % 4 === 3) {
        const target = (i + 3) % nodes.length;
        const key = `${Math.min(i, target)}-${Math.max(i, target)}`;
        if (!seen.has(key)) {
          seen.add(key);
          edges.push({ a: nodes[i], b: nodes[target] });
        }
      }
    }

    const heroIndexes = [2, 6, 11, nodes.length - 2].filter(
      (idx) => idx >= 0 && idx < nodes.length,
    );

    return {
      nodes,
      edges,
      heroes: heroIndexes.map((idx, i) => ({ node: nodes[idx], phase: i })),
    };
  }, [size, density]);

  return (
    <View onLayout={handleLayout} style={[styles.fill, style]} pointerEvents="none">
      {geometry && (
        <Animated.View style={[styles.fill, breathStyle]}>
          <Svg width={size.width} height={size.height}>
            <Defs>
              <RadialGradient id="nodeGlow">
                <Stop offset="0" stopColor="#B99BFF" stopOpacity="0.9" />
                <Stop offset="1" stopColor="#B99BFF" stopOpacity="0" />
              </RadialGradient>
              <RadialGradient id="nodeCore">
                <Stop offset="0" stopColor="#FFFFFF" />
                <Stop offset="0.55" stopColor="#B99BFF" />
                <Stop offset="1" stopColor="#956AFA" />
              </RadialGradient>
            </Defs>

            {geometry.edges.map((edge, index) => (
              <Line
                key={`${edge.a.x}-${edge.a.y}-${index}`}
                x1={edge.a.x}
                y1={edge.a.y}
                x2={edge.b.x}
                y2={edge.b.y}
                stroke="#956AFA"
                strokeWidth={1}
                opacity={0.16}
              />
            ))}

            {geometry.nodes.map((node, index) => (
              <Circle
                key={`dot-${index}`}
                cx={node.x}
                cy={node.y}
                r={node.r}
                fill="#956AFA"
                opacity={0.35}
              />
            ))}

            {geometry.heroes.map((hero, index) => (
              <PulsingNode key={`hero-${index}`} node={hero.node} phase={hero.phase} />
            ))}
          </Svg>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
