export const demoSeed = 240310;

export const demoProfile = {
    id: 'luna-001',
    name: 'Luna',
    age: 25,
    city: 'Brooklyn',
    bio: '',
    lookingFor: '😍 Long-term, open to short',
    profileFacts: [],
    profileScreens: [
        {
            id: 'intro',
            meta: 'Looking for',
            body: '',
            highlight: '😍 Long-term, open to short',
            bullets: [],
            photoPosition: 'center center'
        },
        {
            id: 'basics',
            meta: 'Basics',
            body: '',
            highlight: '5\'8" • Designer • 8 mi away',
            bullets: [],
            photoPosition: 'center 40%'
        },
        {
            id: 'anthem',
            meta: 'Spotify Anthem',
            body: '',
            trackTitle: 'Stand Off',
            trackArtist: 'MEMBA',
            bullets: [],
            photoPosition: 'center 22%'
        }
    ],
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
        { id: 'p1', template: "Serious question: does {interest} rank above coffee in your Sunday lineup?", why: ['interest'] },
        { id: 'p2', template: "Your {caption_label} photo set a high bar. What is the story behind it?", why: ['prompt'] },
        { id: 'p3', template: "If we had 20 minutes in {city}, are we picking espresso, a walk, or both?", why: ['photo'] },
        { id: 'p4', template: "I saw {interest} in your profile and immediately assumed you have elite weekend planning skills.", why: ['bio'] },
        { id: 'p5', template: "You had me at '{prompt_hook}'. What is your current top recommendation?", why: ['city'] },
        { id: 'p6', template: "Fast debate: best post-{interest} snack. I need your official ranking.", why: ['interest'] },
        { id: 'p7', template: "I need a second opinion. Is {interest} actually fun or just a cult?", why: ['prompt'] },
        { id: 'p8', template: "I'm guessing you're the designated {interest} expert in your friend group.", why: ['photo'] },
        { id: 'p9', template: "Your bio mentions '{prompt_hook}'. Are we talking professional level or enthusiastic amateur?", why: ['bio'] },
        { id: 'p10', template: "I bet you have strong feelings about the best {caption_label} in {city}.", why: ['city'] },
        { id: 'p11', template: "I was going to say something smooth, but I got distracted by your {caption_label} photo.", why: ['interest'] },
        { id: 'p12', template: "If you could only do {interest} for the rest of your life, would you survive?", why: ['prompt'] },
        { id: 'p13', template: "You look like someone who knows all the hidden gems in {city}. Spill the secrets.", why: ['photo'] },
        { id: 'p14', template: "I'm taking a poll: {interest} first thing in the morning or late at night?", why: ['bio'] },
        { id: 'p15', template: "I feel like you and I would have a wildly competitive {interest} match.", why: ['city'] },
        { id: 'p16', template: "What's your secret to looking that good while doing {interest}?", why: ['interest'] },
        { id: 'p17', template: "If '{prompt_hook}' is your vibe, I think we're going to get along just fine.", why: ['prompt'] },
        { id: 'p18', template: "Are you always this adventurous, or was the {caption_label} photo a one-time thing?", why: ['photo'] },
        { id: 'p19', template: "I'll trade you my best {city} recommendation for your best {interest} tip.", why: ['bio'] },
        { id: 'p20', template: "Your profile is a 10/10, but your stance on '{prompt_hook}' is the real test.", why: ['city'] },
        { id: 'p21', template: "Is there a story behind the {caption_label} picture, or do you just naturally look that cool?", why: ['interest'] },
        { id: 'p22', template: "We matched! Does this mean we're legally obligated to discuss {interest} now?", why: ['prompt'] },
        { id: 'p23', template: "I'm officially holding you responsible for planning our {interest} date.", why: ['photo'] },
        { id: 'p24', template: "What's the one thing everyone gets wrong about '{prompt_hook}'?", why: ['bio'] },
        { id: 'p25', template: "I've never met a {interest} enthusiast I didn't like. Don't break my streak.", why: ['city'] },
        { id: 'p26', template: "Your smile in the {caption_label} photo is entirely too distracting.", why: ['interest'] },
        { id: 'p27', template: "I need to know: how much {city} coffee fuels your typical weekend?", why: ['prompt'] },
        { id: 'p28', template: "If we went {interest} right now, who would win and why is it me?", why: ['photo'] },
        { id: 'p29', template: "I'm intrigued by '{prompt_hook}'. Please elaborate.", why: ['bio'] },
        { id: 'p30', template: "Are you taking applications for a {interest} partner? Because my resume is ready.", why: ['city'] },
        { id: 'p31', template: "Okay, but be honest—how many tries did it take to get that {caption_label} shot?", why: ['interest'] },
        { id: 'p32', template: "I see you like {interest}. That's cool, but what's your controversial {city} opinion?", why: ['prompt'] },
        { id: 'p33', template: "I'm convinced you're secretly a {interest} pro masquerading as a normal person.", why: ['photo'] },
        { id: 'p34', template: "Tell me your most chaotic '{prompt_hook}' story.", why: ['bio'] },
        { id: 'p35', template: "I'm looking for a tour guide to {city} and you seem overqualified.", why: ['city'] },
        { id: 'p36', template: "Your {caption_label} photo makes me want to drop everything and go on an adventure.", why: ['interest'] },
        { id: 'p37', template: "What is the ultimate playlist for a {interest} session?", why: ['prompt'] },
        { id: 'p38', template: "If I promised you the best coffee in {city}, would you tell me more about '{prompt_hook}'?", why: ['photo'] },
        { id: 'p39', template: "How do you feel about unapologetically competitive games of {interest}?", why: ['bio'] },
        { id: 'p40', template: "I've been staring at your {caption_label} photo trying to guess the context.", why: ['city'] },
        { id: 'p41', template: "I need a partner for {interest} this weekend. Are you brave enough?", why: ['interest'] },
        { id: 'p42', template: "What's the best local spot for '{prompt_hook}'? Asking for a friend (it's me).", why: ['prompt'] },
        { id: 'p43', template: "Your {interest} skills look top-tier. I respect the hustle.", why: ['photo'] },
        { id: 'p44', template: "Can we just skip the small talk and debate the best way to do {interest}?", why: ['bio'] },
        { id: 'p45', template: "That {caption_label} photo is giving major main character energy.", why: ['city'] },
        { id: 'p46', template: "I'm assembling a team for a {city} scavenger hunt. You in?", why: ['interest'] },
        { id: 'p47', template: "Is it possible to be obsessed with '{prompt_hook}'? Because I think I am.", why: ['prompt'] },
        { id: 'p48', template: "Your profile picture tells me you're trouble, but the good kind.", why: ['photo'] },
        { id: 'p49', template: "Serious question: does {interest} rank above coffee in your Sunday lineup?", why: ['bio'] },
        { id: 'p50', template: "Your {caption_label} photo set a high bar. What is the story behind it?", why: ['city'] }
    ],
    raunchy: [
        { id: 'r1', template: "Hello there. I must say, your profile pictures have me intrigued. I can't help but imagine what you're like in person.", why: ['interest'] },
        { id: 'r2', template: "You look like the kind of person who knows how to make a night unforgettable. I'd love to find out.", why: ['prompt'] },
        { id: 'r3', template: "I can't stop thinking about your lips. I wonder what they'd feel like against mine.", why: ['photo'] },
        { id: 'r4', template: "Your profile says you're into {interest}. I'm up for an *adventure* if you are. What do you say?", why: ['bio'] },
        { id: 'r5', template: "I'd love to take you out, but I'd rather take you to my place and see what happens.", why: ['city'] },
        { id: 'r6', template: "Your eyes are doing things to me I can't even describe. I'd love to get to know you better.", why: ['interest'] },
        { id: 'r7', template: "I hope you're ready for a wild night, because I sure am. What are you up for?", why: ['prompt'] },
        { id: 'r8', template: "Your smile in the {caption_label} is almost as tempting as the thought of you naked. I'd love to see what you're hiding under those clothes.", why: ['photo'] },
        { id: 'r9', template: "I'm not one for small talk. I'd rather get to the point and see where this goes.", why: ['bio'] },
        { id: 'r10', template: "You look like you could teach me a few things I've only dreamed about. I'm up for learning.", why: ['city'] },
        { id: 'r11', template: "I'm not usually this forward, but you make me want to break the rules. What do you say?", why: ['interest'] },
        { id: 'r12', template: "I'd love to explore every inch of your body, slowly and carefully. I want to know what makes you tick.", why: ['prompt'] },
        { id: 'r13', template: "You have a look in your eyes that says you're up for anything. I'd love to see what you're up for.", why: ['photo'] },
        { id: 'r14', template: "I can't stop thinking about what your touch might feel like. I wonder if you're as soft as you look.", why: ['bio'] },
        { id: 'r15', template: "Your body is a masterpiece, and I'd love to take my time admiring it.", why: ['city'] },
        { id: 'r16', template: "I'm not just looking for a good time, I'm looking for a *great* time. What do you say?", why: ['interest'] },
        { id: 'r17', template: "I'd love to see how your lips taste when I kiss them. I bet they're as sweet as they look.", why: ['prompt'] },
        { id: 'r18', template: "Your profile makes me want to know more about you. I'd love to take you out and get to know you better.", why: ['photo'] },
        { id: 'r19', template: "I can't help but imagine what it would be like to be wrapped in your arms. I'd love to find out.", why: ['bio'] },
        { id: 'r20', template: "I'm not just looking for a date, I'm looking for a *night* to remember. What do you say?", why: ['city'] },
        { id: 'r21', template: "Do you think you can handle someone like me after a few drinks in {city}?", why: ['interest'] },
        { id: 'r22', template: "I can tell by your {caption_label} photo that you know how to be bad.", why: ['prompt'] },
        { id: 'r23', template: "I've got a feeling your '{prompt_hook}' is exactly what I need tonight.", why: ['photo'] },
        { id: 'r24', template: "Is it just me, or is it getting hot in here just looking at your profile?", why: ['bio'] },
        { id: 'r25', template: "I usually save my best moves for later, but you're making me impatient.", why: ['city'] },
        { id: 'r26', template: "If you're half as wild as your {interest} suggests, we're in for a fun time.", why: ['interest'] },
        { id: 'r27', template: "I'm trying to decide if you're a good influence or a delightfully bad one.", why: ['prompt'] },
        { id: 'r28', template: "What's the most scandalous thing you've ever done in {city}?", why: ['photo'] },
        { id: 'r29', template: "Your {caption_label} picture gave me some very inappropriate thoughts.", why: ['bio'] },
        { id: 'r30', template: "Are you going to make me misbehave, or do I have to do it by myself?", why: ['city'] },
        { id: 'r31', template: "I'm craving a little danger tonight. Are you available?", why: ['interest'] },
        { id: 'r32', template: "If I told you what I was thinking about right now, I might get banned from Tinder.", why: ['prompt'] },
        { id: 'r33', template: "I bet you look incredible in the morning without any makeup on.", why: ['photo'] },
        { id: 'r34', template: "There's only one thing I want to do more than {interest} right now.", why: ['bio'] },
        { id: 'r35', template: "What's your favorite position... to watch a movie in? Just kidding, I mean the other thing.", why: ['city'] },
        { id: 'r36', template: "Are you ticklish? I need to know for science. And other reasons.", why: ['interest'] },
        { id: 'r37', template: "I'm picturing you tangled up in my sheets. It's a very vivid picture.", why: ['prompt'] },
        { id: 'r38', template: "If you were a dessert, I'd skip dinner and go straight to you.", why: ['photo'] },
        { id: 'r39', template: "Does your '{prompt_hook}' translate well into the bedroom?", why: ['bio'] },
        { id: 'r40', template: "You have the kind of vibe that makes me want to lock the door and lose the key.", why: ['city'] },
        { id: 'r41', template: "I'm not sure what we're going to talk about, because I'm just going to be staring at your lips.", why: ['interest'] },
        { id: 'r42', template: "I need a partner in crime tonight. What are you wearing?", why: ['prompt'] },
        { id: 'r43', template: "Your {caption_label} photo has me completely mesmerized.", why: ['photo'] },
        { id: 'r44', template: "Is there a quiet spot in {city} where we won't be interrupted?", why: ['bio'] },
        { id: 'r45', template: "I think we both know where this conversation is heading.", why: ['city'] },
        { id: 'r46', template: "I am very good at {interest}. Also very good at other things.", why: ['interest'] },
        { id: 'r47', template: "I want to make you blush. Am I succeeding?", why: ['prompt'] },
        { id: 'r48', template: "Let's skip dinner and skip straight to the dessert.", why: ['photo'] },
        { id: 'r49', template: "Are you as fun beneath the sheets as you are on paper?", why: ['bio'] },
        { id: 'r50', template: "You look like pure temptation. And I have zero self-control.", why: ['city'] }
    ],
    intellectual: [
        { id: 'i1', template: "I saw {interest} in your profile. What is your most controversial opinion on the subject?", why: ['interest'] },
        { id: 'i2', template: "You mentioned '{prompt_hook}'. I would love to hear a deep dive on why that matters to you.", why: ['prompt'] },
        { id: 'i3', template: "Your {caption_label} photo is intriguing. It speaks to a very specific aesthetic.", why: ['photo'] },
        { id: 'i4', template: "If you had to recommend one book for someone visiting {city}, what would it be?", why: ['bio'] },
        { id: 'i5', template: "I appreciate a profile with substance. Tell me something you learned recently that blew your mind.", why: ['city'] },
        { id: 'i6', template: "What do you think is the biggest misconception about {interest}?", why: ['interest'] },
        { id: 'i7', template: "If you could write a thesis on '{prompt_hook}', what would the core argument be?", why: ['prompt'] },
        { id: 'i8', template: "Which philosopher would have the most to say about your {caption_label} photo?", why: ['photo'] },
        { id: 'i9', template: "I'm curious about the cultural significance of {interest} in a place like {city}.", why: ['bio'] },
        { id: 'i10', template: "What defines a truly meaningful '{prompt_hook}' experience for you?", why: ['city'] },
        { id: 'i11', template: "Let's skip the small talk. How has {interest} fundamentally changed your perspective?", why: ['interest'] },
        { id: 'i12', template: "Are your opinions on {interest} shaped by experience or formal study?", why: ['prompt'] },
        { id: 'i13', template: "What is a paradigm shift you've had recently regarding '{prompt_hook}'?", why: ['photo'] },
        { id: 'i14', template: "There's clearly a narrative behind the {caption_label} photo. Care to share?", why: ['bio'] },
        { id: 'i15', template: "I'm interested in how the architecture of {city} influences its social dynamics.", why: ['city'] },
        { id: 'i16', template: "What is a book or documentary about {interest} that everyone should consume?", why: ['interest'] },
        { id: 'i17', template: "Do you think society's approach to '{prompt_hook}' is evolving or regressing?", why: ['prompt'] },
        { id: 'i18', template: "The aesthetic of your {caption_label} photo suggests a profound appreciation for existentialism.", why: ['photo'] },
        { id: 'i19', template: "How do you balance the theoretical and practical aspects of {interest}?", why: ['bio'] },
        { id: 'i20', template: "If you had to synthesize your view on '{prompt_hook}' into one sentence, what is it?", why: ['city'] },
        { id: 'i21', template: "I've been analyzing the sociopolitical implications of {interest}. Thoughts?", why: ['interest'] },
        { id: 'i22', template: "What historical figure would you most like to discuss '{prompt_hook}' with?", why: ['prompt'] },
        { id: 'i23', template: "Your {caption_label} picture evokes a sense of profound melancholy. Intentional?", why: ['photo'] },
        { id: 'i24', template: "What's the most beautiful, untranslatable word you know regarding {interest}?", why: ['bio'] },
        { id: 'i25', template: "I consider {city} to be a microcosm of modern society. Do you agree?", why: ['city'] },
        { id: 'i26', template: "Has the commodification of {interest} ruined its original essence?", why: ['interest'] },
        { id: 'i27', template: "What cognitive biases do you think affect how people perceive '{prompt_hook}'?", why: ['prompt'] },
        { id: 'i28', template: "I feel like a conversation with you about {interest} would shatter my worldview.", why: ['photo'] },
        { id: 'i29', template: "Is there an objective standard of beauty when it comes to {caption_label}?", why: ['bio'] },
        { id: 'i30', template: "I'm compiling a reading list on {interest}. Give me your core texts.", why: ['city'] },
        { id: 'i31', template: "To what extent does '{prompt_hook}' define the human condition?", why: ['interest'] },
        { id: 'i32', template: "Do you view the city of {city} as an expanding entity or a decaying one?", why: ['prompt'] },
        { id: 'i33', template: "Can we have a dialectic on the nature of {interest} over coffee?", why: ['photo'] },
        { id: 'i34', template: "What's the epistemological foundation of your belief in '{prompt_hook}'?", why: ['bio'] },
        { id: 'i35', template: "The composition of that {caption_label} shot implies a strong grasp of negative space.", why: ['city'] },
        { id: 'i36', template: "In a post-truth era, how do you verify the authenticity of {interest}?", why: ['interest'] },
        { id: 'i37', template: "What is the most misunderstood facet of '{prompt_hook}'?", why: ['prompt'] },
        { id: 'i38', template: "Do you subscribe to the idea that {city}'s layout dictates its residents' behavior?", why: ['photo'] },
        { id: 'i39', template: "I am fascinated by the dichotomy between {interest} and modern technology.", why: ['bio'] },
        { id: 'i40', template: "What empirical evidence supports your stance on '{prompt_hook}'?", why: ['city'] },
        { id: 'i41', template: "Are we all just performing our identities, much like what's happening in your {caption_label} photo?", why: ['interest'] },
        { id: 'i42', template: "I want to hear your most rigorous critique of {interest}.", why: ['prompt'] },
        { id: 'i43', template: "If you could instantly impart your knowledge of '{prompt_hook}' to one person, who would it be?", why: ['photo'] },
        { id: 'i44', template: "What defines the zeitgeist of {city} right now?", why: ['bio'] },
        { id: 'i45', template: "Is the pursuit of {interest} inherently a selfish endeavor?", why: ['city'] },
        { id: 'i46', template: "What is the semantic distinction between '{prompt_hook}' and related concepts?", why: ['interest'] },
        { id: 'i47', template: "Your {caption_label} photo looks like a scene from a poignant indie film.", why: ['prompt'] },
        { id: 'i48', template: "I'm writing a paper on the phenomenology of {interest}. Want to be cited?", why: ['photo'] },
        { id: 'i49', template: "I saw {interest} in your profile. What is your most controversial opinion on the subject?", why: ['bio'] },
        { id: 'i50', template: "You mentioned '{prompt_hook}'. I would love to hear a deep dive on why that matters to you.", why: ['city'] }
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
