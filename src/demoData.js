export const demoSeed = 240310;

export const demoProfile = {
    id: 'emily-prakanazech-001',
    name: 'Emily Prakanazech',
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
    raunchy: [
        { id: 'r1', template: "Hello there. I must say, your profile pictures have me intrigued. I can't help but imagine what you're like in person.", why: ['photo', 'bio'] },
        { id: 'r2', template: "You look like the kind of person who knows how to make a night unforgettable. I'd love to find out.", why: ['bio'] },
        { id: 'r3', template: "I can't stop thinking about your lips. I wonder what they'd feel like against mine.", why: ['photo'] },
        { id: 'r4', template: "Your profile says you're into {interest}. I'm up for an *adventure* if you are. What do you say?", why: ['interest'] },
        { id: 'r5', template: "I'd love to take you out, but I'd rather take you to my place and see what happens.", why: ['bio'] },
        { id: 'r6', template: "Your eyes are doing things to me I can't even describe. I'd love to get to know you better.", why: ['photo'] },
        { id: 'r7', template: "I hope you're ready for a wild night, because I sure am. What are you up for?", why: ['bio'] },
        { id: 'r8', template: "Your smile is almost as tempting as the thought of you naked. I'd love to see what you're hiding under those clothes.", why: ['photo'] },
        { id: 'r9', template: "I'm not one for small talk. I'd rather get to the point and see where this goes.", why: ['bio'] },
        { id: 'r10', template: "You look like you could teach me a few things I've only dreamed about. I'm up for learning.", why: ['bio'] },
        { id: 'r11', template: "I'm not usually this forward, but you make me want to break the rules. What do you say?", why: ['bio'] },
        { id: 'r12', template: "I'd love to explore every inch of your body, slowly and carefully. I want to know what makes you tick.", why: ['photo'] },
        { id: 'r13', template: "You have a look in your eyes that says you're up for anything. I'd love to see what you're up for.", why: ['photo'] },
        { id: 'r14', template: "I can't stop thinking about what your touch might feel like. I wonder if you're as soft as you look.", why: ['photo'] },
        { id: 'r15', template: "Your body is a masterpiece, and I'd love to take my time admiring it.", why: ['photo'] },
        { id: 'r16', template: "I'm not just looking for a good time, I'm looking for a *great* time. What do you say?", why: ['bio'] },
        { id: 'r17', template: "I'd love to see how your lips taste when I kiss them. I bet they're as sweet as they look.", why: ['photo'] },
        { id: 'r18', template: "Your profile makes me want to know more about you. I'd love to take you out and get to know you better.", why: ['bio'] },
        { id: 'r19', template: "I can't help but imagine what it would be like to be wrapped in your arms. I'd love to find out.", why: ['photo'] },
        { id: 'r20', template: "I'm not just looking for a date, I'm looking for a *night* to remember. What do you say?", why: ['bio'] }
    ],
    intellectual: [
        { id: 'i1', template: 'I saw {interest} in your profile. What is your most controversial opinion on the subject?', why: ['interest'] },
        { id: 'i2', template: 'You mentioned "{prompt_hook}". I would love to hear a deep dive on why that matters to you.', why: ['prompt answer'] },
        { id: 'i3', template: 'Your {caption_label} photo is intriguing. It speaks to a very specific aesthetic.', why: ['photo label'] },
        { id: 'i4', template: 'If you had to recommend one book for someone visiting {city}, what would it be?', why: ['city'] },
        { id: 'i5', template: 'I appreciate a profile with substance. Tell me something you learned recently that blew your mind.', why: ['bio'] }
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
