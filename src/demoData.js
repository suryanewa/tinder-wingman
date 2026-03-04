export const demoSeed = 240310;

export const demoProfile = {
    id: 'ava-chen-001',
    name: 'Ava Chen',
    age: 27,
    city: 'Brooklyn',
    bio: 'Climber, coffee spot hunter, and trivia-night regular. Always up for a museum detour on Sundays.',
    prompts: [
        'Typical Sunday: farmers market, long walk, then trying a new cafe.',
        'I am overly competitive about board games but still cheerful about losing.'
    ],
    interests: ['Bouldering', 'Third-wave coffee', 'Museums', 'Trivia nights'],
    photoCaptionLabels: ['climbing gym', 'latte art', 'sunset rooftop']
};

export const demoUserPrefs = {
    tone: 'playful',
    avoidTopics: ['exes', 'money', 'politics']
};

export const initialDemoMessages = [
    { id: 'msg-1', author: 'match', text: 'hey! your travel pics were so cool' },
    { id: 'msg-2', author: 'match', text: 'how has your week been?' }
];

const lineLibrary = {
    playful: [
        { id: 'p1', template: 'Serious question: does {interest} rank above coffee in your Sunday lineup?', why: ['interest', 'prompt'] },
        { id: 'p2', template: 'Your {caption_label} photo set a high bar. What is the story behind it?', why: ['photo label'] },
        { id: 'p3', template: 'If we had 20 minutes in {city}, are we picking espresso, a walk, or both?', why: ['city', 'bio'] },
        { id: 'p4', template: 'I saw {interest} in your profile and immediately assumed you have elite weekend planning skills.', why: ['interest'] },
        { id: 'p5', template: 'You had me at "{prompt_hook}". What is your current top recommendation?', why: ['prompt answer'] },
        { id: 'p6', template: 'Fast debate: best post-{interest} snack. I need your official ranking.', why: ['interest'] }
    ],
    direct: [
        { id: 'd1', template: 'I liked your profile. Want to swap favorite {interest} spots this week?', why: ['interest'] },
        { id: 'd2', template: 'You mentioned "{prompt_hook}" - what is your go-to version of that?', why: ['prompt answer'] },
        { id: 'd3', template: 'Your {caption_label} photo stood out. What made that moment memorable?', why: ['photo label'] },
        { id: 'd4', template: 'I am planning a {city} weekend list. What should go at the top?', why: ['city'] },
        { id: 'd5', template: 'If you had one free hour this weekend, what would you do first?', why: ['bio'] }
    ],
    dry: [
        { id: 'r1', template: 'You had me at {interest}. I respect a focused profile.', why: ['interest'] },
        { id: 'r2', template: 'Your "{prompt_hook}" line did better than most opening acts.', why: ['prompt answer'] },
        { id: 'r3', template: 'This is me pretending to be chill about your {caption_label} photo.', why: ['photo label'] },
        { id: 'r4', template: 'I can offer one useful topic: the best coffee near {city}.', why: ['city'] },
        { id: 'r5', template: 'Strong profile. Minimal notes. Maximum curiosity.', why: ['bio'] }
    ]
};

const fallbackTemplates = [
    'Quick opener: what has been the highlight of your week so far?',
    'Your profile seems fun. What are you excited about this weekend?',
    'Would you rather start with coffee, a walk, or a question game?'
];

function hashString(value) {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i += 1) {
        hash ^= value.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}

function createRng(seed) {
    let state = seed >>> 0;
    return () => {
        state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
        return state / 0x100000000;
    };
}

function seededShuffle(items, seed) {
    const shuffled = [...items];
    const random = createRng(seed);
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function firstOrFallback(values, fallback) {
    return values && values.length > 0 ? values[0] : fallback;
}

function extractPromptHook(profile) {
    const raw = firstOrFallback(profile.prompts, 'weekend plans');
    const clean = raw.replace(/^.*?:\s*/i, '').trim();
    return clean.split(/[.!?]/)[0] || 'weekend plans';
}

function fillTemplate(template, profile) {
    const tokenMap = {
        interest: firstOrFallback(profile.interests, 'weekend plans'),
        prompt_hook: extractPromptHook(profile),
        caption_label: firstOrFallback(profile.photoCaptionLabels, 'profile'),
        city: profile.city || 'your neighborhood'
    };

    return template.replace(/\{([a-z_]+)\}/g, (_, token) => tokenMap[token] || 'your profile');
}

function buildWhyLabel(parts) {
    return `Based on: ${parts.join(' + ')}`;
}

export function getDeterministicSuggestions(profile, tone, seed = demoSeed, count = 3) {
    const toneLines = lineLibrary[tone] || lineLibrary.playful;
    const combinedSeed = seed + hashString(profile.id) + hashString(tone);
    const shuffled = seededShuffle(toneLines, combinedSeed);
    const results = [];
    const seen = new Set();

    for (const entry of shuffled) {
        const text = fillTemplate(entry.template, profile);
        if (!text || seen.has(text)) continue;
        seen.add(text);
        results.push({
            id: entry.id,
            text,
            why: buildWhyLabel(entry.why)
        });
        if (results.length === count) return results;
    }

    const fallback = seededShuffle(fallbackTemplates, combinedSeed + 31);
    for (const text of fallback) {
        if (seen.has(text)) continue;
        seen.add(text);
        results.push({
            id: `fb-${results.length + 1}`,
            text,
            why: 'Based on: safe fallback'
        });
        if (results.length === count) break;
    }

    return results;
}

export function createChatState(seedMessages = initialDemoMessages) {
    return {
        messages: [...seedMessages],
        draft: '',
        selectedSuggestionId: null
    };
}

export function applySuggestionToDraft(state, suggestion) {
    return {
        ...state,
        draft: suggestion.text,
        selectedSuggestionId: suggestion.id
    };
}

export function updateChatDraft(state, draft) {
    return {
        ...state,
        draft
    };
}

export function sendDraftMessage(state) {
    const nextText = state.draft.trim();
    if (!nextText) return state;

    return {
        messages: [
            ...state.messages,
            {
                id: `msg-${state.messages.length + 1}`,
                author: 'you',
                text: nextText
            }
        ],
        draft: '',
        selectedSuggestionId: null
    };
}
