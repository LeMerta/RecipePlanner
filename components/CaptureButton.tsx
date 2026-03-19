import { colors, radius } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import html2canvas from 'html2canvas';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

type Props = {
  targetRef: React.RefObject<View | null>;
};

/** Button to save a recipe as picture */
export function CaptureButton({ targetRef }: Props) {
  const [loading, setLoading] = useState(false);
  const buttonRef = useRef<View>(null);       // ref to the capture button to exclude it from the screenshot

  // Captures the recipe panel as a PNG and triggers a browser download
  const handleCapture = async () => {
    if (!targetRef.current) return;

    // React Native Web renders Views as divs — cast to HTMLElement
    const element = targetRef.current as unknown as HTMLElement;

    setLoading(true);
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: colors.background,
        scale: 2, 
        useCORS: true,
        logging: false,
        ignoreElements: (el) => el === (buttonRef.current as unknown as HTMLElement), //excludes CaptureButton
      });

      // Trigger the native browser Save As dialog
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'recipe.png';
        a.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (e) {
      console.error('Capture failed', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable 
      ref={buttonRef}
      onPress={handleCapture}
      disabled={loading}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        loading && styles.disabled,
      ]}
    >
      <Ionicons 
        name="download" 
        size={20} 
        color={loading ? colors.background : colors.background}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    backgroundColor: colors.accentDim,
  },
});