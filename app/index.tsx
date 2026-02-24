import { useRecipeChat } from '@/hooks/useRecipeChat';
import React from 'react';
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function HomePage() {
  const { messages, recipe, isLoading, sendMessage } = useRecipeChat();
  const [input, setInput] = React.useState('');

  async function send() {
    if (!input.trim()) return;
    setInput('');
    await sendMessage(input);
  }

  return (
    <View style={styles.container}>
      {/* ── Left: Recipe Panel ── */}
      <View style={styles.left}>
        <Text style={styles.leftTitle}>Recipe</Text>
        <ScrollView style={styles.leftContent}>
          {recipe ? (
            <>
              <Text style={styles.recipeTitle}>{recipe.title}</Text>
              <Text style={styles.recipeDescription}>{recipe.description}</Text>

              <Text style={styles.sectionTitle}>
                {recipe.servings} servings · {recipe.prepTimeMinutes}min prep · {recipe.cookTimeMinutes}min cook
              </Text>

              <Text style={styles.sectionTitle}>Ingredients</Text>
              {recipe.ingredients.map((ing, i) => (
                <Text key={i} style={styles.recipeText}>
                  · {ing.amount}{ing.unit ? ` ${ing.unit}` : ''} {ing.name}
                </Text>
              ))}

              <Text style={styles.sectionTitle}>Steps</Text>
              {recipe.steps.map((step, i) => (
                <Text key={i} style={styles.recipeText}>
                  {i + 1}. {step}
                </Text>
              ))}
            </>
          ) : (
            <Text style={{ color: '#666' }}>Recipe from the conversation will appear here.</Text>
          )}
        </ScrollView>
      </View>

      {/* ── Right: Chat Panel ── */}
      <View style={styles.right}>
        <ScrollView style={styles.messages} contentContainerStyle={styles.messagesContainer}>
          {messages.map((m) => (
            <View key={m.id} style={[styles.messageBubble, m.role === 'user' ? styles.userMessage : styles.assistantMessage]}>
              <Text style={styles.messageRole}>{m.role === 'user' ? 'You' : 'Assistant'}</Text>
              <Text style={[styles.message, m.role === 'user' && { color: '#fff' }]}>{m.content}</Text>
            </View>
          ))}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#0066cc" />
              <Text style={styles.loadingText}>Assistant is typing...</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            onSubmitEditing={send}
            returnKeyType="send"
            editable={!isLoading}
          />
          <Button title="Send" onPress={send} disabled={isLoading} />
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
  recipeTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  recipeDescription: { fontSize: 13, color: '#555', marginBottom: 12, lineHeight: 18 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#444', marginTop: 12, marginBottom: 4 },
  recipeText: { fontSize: 14, lineHeight: 22 },
  right: { flex: 1, display: 'flex', flexDirection: 'column' },
  messages: { flex: 1, padding: 16, backgroundColor: '#fff' },
  messagesContainer: { paddingBottom: 16 },
  messageBubble: { marginBottom: 12, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, maxWidth: '80%' },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#0066cc' },
  assistantMessage: { alignSelf: 'flex-start', backgroundColor: '#e8e8e8' },
  messageRole: { fontSize: 12, fontWeight: '600', marginBottom: 4, color: '#666' },
  message: { fontSize: 14, lineHeight: 20, color: '#000' },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  loadingText: { fontSize: 14, color: '#666' },
  inputRow: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderTopColor: '#eee', alignItems: 'center' },
  input: { flex: 1, marginRight: 8, paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 6, backgroundColor: '#fff' },
});