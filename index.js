let pattern;
let repeatCount;
let tala;
let nadai;
let currentDifficulty;
let previousAnswer;
const nadais = {
    one: { name: "first speed chatusra", subdivisions: 1 },
    two: { name: "second speed chatusra", subdivisions: 2 },
    tisra: { name: "tisra", subdivisions: 3 },
    chatusra: { name: "third speed chatusra", subdivisions: 4 },
    khanda: { name: "khanda", subdivisions: 5 },
    fast_tisra: { name: "second speed tisra", subdivisions: 6 },
    misra: { name: "misra", subdivisions: 7 },
    fast_chatusra: { name: "fourth speed chatusra", subdivisions: 8 },
    sankeerna: { name: "sankeerna", subdivisions: 9 }
};

const talas = {
    adi: {
        name: "adi",
        nadais: [nadais.two, nadais.chatusra, nadais.tisra, nadais.khanda, nadais.misra, nadais.sankeerna],
        length: 8
    },
    rupaka: {
        name: "rupaka",
        nadais: [nadais.two, nadais.chatusra, nadais.tisra, nadais.khanda, nadais.misra, nadais.sankeerna],
        length: 3
    },
    misra_chapu: {
        name: "misra chapu",
        nadais: [nadais.one, nadais.two, nadais.tisra],
        length: 7
    },
    khanda_chapu: {
        name: "khanda chapu",
        nadais: [nadais.one, nadais.two, nadais.tisra],
        length: 5
    },
    sankeerna_chapu: {
        name: "sankeerna chapu",
        nadais: [nadais.one, nadais.two, nadais.tisra],
        length: 9
    },
    jampa: {
        name: "jampa",
        nadais: [nadais.chatusra, nadais.tisra, nadais.khanda, nadais.misra],
        length: 10
    },
};

const difficulties = {
    easy: {
        name: "Easy",
        maxRepetitionCount: 1,
        maxPatternLength: 1,
        maxValueInPatternSequence: (talaLength, nadaiSubdivisions) => 3 * talaLength * nadaiSubdivisions,
        allowedNadais: [nadais.one, nadais.two, nadais.chatusra]
    },
    medium: {
        name: "Medium",
        maxRepetitionCount: 5,
        maxPatternLength: 5,
        maxValueInPatternSequence: (talaLength, nadaiSubdivisions) => talaLength * nadaiSubdivisions,
        allowedNadais: [nadais.one, nadais.two, nadais.chatusra, nadais.tisra, nadais.fast_tisra]
    },
    intermediate: {
        name: "Intermediate",
        maxRepetitionCount: 5,
        maxPatternLength: 9,
        maxValueInPatternSequence: (talaLength, nadaiSubdivisions) => talaLength * nadaiSubdivisions,
        allowedNadais: [nadais.one, nadais.two, nadais.chatusra, nadais.tisra, nadais.fast_tisra, nadais.khanda, nadais.misra, nadais.sankeerna],
    },
    hard: {
        name: "Hard",
        maxRepetitionCount: 7,
        maxPatternLength: 13,
        maxValueInPatternSequence: (talaLength, nadaiSubdivisions) => 3 * talaLength * nadaiSubdivisions,
        allowedNadais: [nadais.one, nadais.two, nadais.chatusra, nadais.tisra, nadais.fast_tisra, nadais.khanda, nadais.misra, nadais.sankeerna],
    }
}

function setup() { 
    const defaultName = Object.keys(difficulties)[0];
    currentDifficulty = difficulties[defaultName];
    generate();
    for (const difficulty in difficulties) {
        const selectorDiv = document.getElementById("difficulty-selector");
        selectorDiv.innerHTML += `<button type="button" class="difficulty-btn ${(difficulty == defaultName) ? 'selected' : ''}" data-difficulty="${difficulty}">${difficulties[difficulty].name}</button>`
    }
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            currentDifficulty = difficulties[btn.getAttribute('data-difficulty')];
            generate();
    });
});

}

function clearAnswer() { 
    const answer = document.getElementById("answer");
    answer.className = "";
    answer.value = "";
}

function updateUI() { 
    document.getElementById("pattern").innerText = pattern.join(" - "); 
    document.getElementById("repeats").innerText = repeatCount;
    document.getElementById("talam").innerText = tala.name;
    document.getElementById("talam-beat-count").innerText = tala.length;
    document.getElementById("nadai").innerText = nadai.name;
    document.getElementById("nadai-subdivisions-count").innerText = nadai.subdivisions;
    document.getElementById("nadai-subdivisions-count").innerText = nadai.subdivisions;
    document.getElementById('previous-answer').innerText = previousAnswer;
}

function generate() {
    const possibleTalas = Object.keys(talas);
    tala = talas[possibleTalas[Math.floor(Math.random() * possibleTalas.length)]];
    
    const possibleNadais = Array.from(new Set(currentDifficulty.allowedNadais).intersection(new Set(tala.nadais)));
    nadai = possibleNadais[Math.floor(Math.random() * possibleNadais.length)];
    
    pattern = [];
    repeatCount = Math.floor(Math.random() * (currentDifficulty.maxRepetitionCount - 1)) + 1;
    const patternLength = Math.floor(Math.random() * (currentDifficulty.maxPatternLength - 1)) + 1;
    for (let i = 0; i < patternLength; i++) {
        pattern.push(Math.floor(Math.random() * (currentDifficulty.maxValueInPatternSequence(tala.length, nadai.subdivisions) - 1)) + 1);
    }

    clearAnswer();
    updateUI();
}

function check() {
    const answer = document.getElementById("answer");
    const sum = pattern.reduce((accumulator, currentValue) => accumulator + currentValue, 0) * repeatCount;
    const matras = tala.length * nadai.subdivisions;
    if (parseInt(answer.value) % (matras - (sum % matras)) == 0) {
        previousAnswer = answer.value;
        generate();
    } else {
        answer.className = "wrong-answer";
    }
}

setup();