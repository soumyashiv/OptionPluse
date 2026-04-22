import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

interface Props  { children: ReactNode }
interface State  { hasError: boolean; error?: Error }

/**
 * React error boundary that catches unhandled JS errors in the render tree.
 * Prevents the entire app from going white-screen on unexpected exceptions.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to console for now; hook into Sentry/Bugsnag here in production.
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => this.setState({ hasError: false, error: undefined });

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>⚠️</Text>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </Text>
          <TouchableOpacity style={styles.btn} onPress={this.handleReset} activeOpacity={0.8}>
            <Text style={styles.btnText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  emoji:   { fontSize: 48 },
  title:   { fontSize: 22, fontWeight: '700', color: '#1A1C1D' },
  message: { fontSize: 13, color: '#71717A', textAlign: 'center', lineHeight: 20 },
  btn: {
    marginTop: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
});
