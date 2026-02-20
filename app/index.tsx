import React from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const sampleRecipe = `Spaghetti Aglio e Olio

Ingredients:
- 200g spaghetti
- 3 cloves garlic, thinly sliced
- 1/4 cup extra-virgin olive oil
- 1/2 tsp red pepper flakes
- Salt and black pepper to taste
- Fresh parsley, chopped

Steps:
1. Boil spaghetti in salted water until al dente.
2. Meanwhile, gently heat olive oil and sauté garlic until fragrant.
3. Add red pepper flakes and remove from heat.
4. Toss drained pasta with the garlic oil, season, and garnish with parsley.`;

export default function HomePage() {
  const [messages, setMessages] = React.useState<string[]>(["Welcome! This is a demo conversation."]);
  const [input, setInput] = React.useState('');
  const [recipe, setRecipe] = React.useState<string | null>(sampleRecipe);

  function send() {
    if (!input.trim()) return;

    setMessages((m) => [...m, `You: ${input}`]);

    // Demo behavior: populate the left panel with a sample recipe when user asks for one
    const lower = input.toLowerCase();
    const triggers = ['recipe', 'cook', 'make', 'generate'];
    if (triggers.some((t) => lower.includes(t))) {
      setRecipe(sampleRecipe);
      setMessages((m) => [...m, 'System: Generated a sample recipe for you.']);
    }

    setInput('');
  }

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.leftTitle}>Recipe</Text>
        <ScrollView style={styles.leftContent}>
          {recipe ? (
            <Text style={styles.recipeText}>{recipe}</Text>
          ) : (
            <Text style={{ color: '#666' }}>Recipe from the conversation will appear here.</Text>
          )}
        </ScrollView>
      </View>

      <View style={styles.right}>
        <ScrollView style={styles.messages} contentContainerStyle={styles.messagesContainer}>
          {messages.map((m, i) => (
            <Text key={i} style={styles.message}>
              {m}
            </Text>
          ))}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            onSubmitEditing={send}
            returnKeyType="send"
          />
          <Button title="Send" onPress={send} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row' },
  left: { flex: 1, borderRightWidth: 1, borderRightColor: '#ddd', padding: 16, backgroundColor: '#f7f7f7' },
  leftTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  leftContent: { flex: 1 },
  recipeText: { fontSize: 14, lineHeight: 20 },
  right: { flex: 1, display: 'flex', flexDirection: 'column' },
  messages: { flex: 1, padding: 16, backgroundColor: '#fff' },
  messagesContainer: { paddingBottom: 16 },
  message: { marginBottom: 8, fontSize: 14 },
  inputRow: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderTopColor: '#eee', alignItems: 'center' },
  input: { flex: 1, marginRight: 8, paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 6, backgroundColor: '#fff' },
});
