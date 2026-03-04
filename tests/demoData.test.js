import test from 'node:test';
import assert from 'node:assert/strict';
import {
    demoProfile,
    getDeterministicSuggestions,
    createChatState,
    applySuggestionToDraft,
    updateChatDraft,
    sendDraftMessage
} from '../src/demoData.js';

test('getDeterministicSuggestions returns stable ordered results for same inputs', () => {
    const first = getDeterministicSuggestions(demoProfile, 'playful', 12345, 3);
    const second = getDeterministicSuggestions(demoProfile, 'playful', 12345, 3);
    assert.deepEqual(second, first);
});

test('getDeterministicSuggestions returns 3 unique suggestion texts', () => {
    const suggestions = getDeterministicSuggestions(demoProfile, 'intellectual', 54321, 3);
    assert.equal(suggestions.length, 3);
    assert.equal(new Set(suggestions.map((item) => item.text)).size, 3);
});

test('getDeterministicSuggestions fills missing token data with safe fallback text', () => {
    const sparseProfile = {
        ...demoProfile,
        interests: [],
        prompts: [],
        photoCaptionLabels: [],
        city: ''
    };
    const suggestions = getDeterministicSuggestions(sparseProfile, 'unknown-tone', 111, 3);
    assert.equal(suggestions.length, 3);
    suggestions.forEach((suggestion) => {
        assert.ok(!suggestion.text.includes('{'));
    });
});

test('different seeds produce different playful suggestions', () => {
    const first = getDeterministicSuggestions(demoProfile, 'playful', 101, 3).map((item) => item.id);
    const second = getDeterministicSuggestions(demoProfile, 'playful', 202, 3).map((item) => item.id);
    assert.notDeepEqual(second, first);
});

test('raunchy tone always returns the pinned three lines in order', () => {
    const suggestions = getDeterministicSuggestions(demoProfile, 'raunchy', 777, 3);
    assert.deepEqual(
        suggestions.map((item) => item.id),
        ['r8', 'r28', 'r35']
    );
});

test('chat state supports select -> edit -> send flow', () => {
    const suggestion = { id: 's-demo', text: 'We should compare trivia categories this week.' };
    let state = createChatState([]);
    state = applySuggestionToDraft(state, suggestion);
    assert.equal(state.draft, suggestion.text);
    assert.equal(state.selectedSuggestionId, suggestion.id);

    state = updateChatDraft(state, `${state.draft} Winner picks the coffee shop.`);
    assert.ok(state.draft.includes('Winner picks the coffee shop.'));

    const sentState = sendDraftMessage(state);
    assert.equal(sentState.messages.length, 1);
    assert.equal(sentState.messages[0].author, 'you');
    assert.equal(sentState.draft, '');
    assert.equal(sentState.selectedSuggestionId, null);
});
