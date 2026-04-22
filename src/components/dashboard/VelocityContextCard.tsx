import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Radius, Typography } from '../../theme';

export const VelocityContextCard = () => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconBox}>
          <MaterialIcons name="auto-awesome" size={20} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>Historical Context</Text>
      </View>

      <Text style={styles.description}>
        The index has maintained a bullish trend for the past 14 days, currently
        sitting in the upper quartile of the 3-month range. This persistent
        acceleration suggests a widening market participation and strong capital
        inflow across primary derivative markets.
      </Text>

      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=800' }}
          style={styles.image}
        />
        <View style={styles.imageOverlay} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF0EE',
    borderRadius: Radius.xl,
    padding: 20,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.titleMd,
    color: '#1A1C1D',
  },
  description: {
    ...Typography.bodySm,
    color: '#5d3f3b',
    lineHeight: 21,
    fontWeight: '500',
  },
  imageWrapper: {
    height: 130,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(95, 63, 59, 0.25)',
  },
});
