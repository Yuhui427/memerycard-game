// var $name = $('#Name')
// var $difficulty = $('#selectLevel')
// var $counter = $('.counter')
var userInfo = JSON.parse(localStorage.getItem('userInfo')) || {} //All information of users and games
var currName = '' //Current username
var currQusetion = 0 //Current question's index

//Countdown Clock
var timer = null
var sec = 31

//dog breeds show
class dog {
    constructor(id, url, image, b_id) {
        this.id = id;
        this.url = url;
        this.image = image;
        this.b_id = b_id;
    }
}

var dogList = new Array();
var checkedList = new Array();
var page = 1;
var jslength = 0;

// identify HashMap in JS
class HashMap {
    constructor() {
        this.map = {}
    }
    put(key, value) {
        this.map[key] = value
    }
    get(key) {
        if (this.map.hasOwnProperty(key)) {
            return this.map[key]
        }
        return null
    }
    remove(key) {
        if (this.map.hasOwnProperty(key)) {
            return delete this.map[key]
        }
        return false
    }
    removeAll() {
        this.map = {}
    }
    keySet() {
        var _keys = []
        for (var i in this.map) {
            _keys.push(i)
        }
        return _keys
    }
};
var map = new HashMap();
var dogMap = new HashMap();

// leaderboard
renderTop10();

/* The code below was taken from a post at https://www.codenong.com/19706046/* (last accessed 2020-11-25)*/
/*BEGIN Copied Code */
function ajax_get(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log('responseText:' + xmlhttp.responseText);
            try {
                var data = JSON.parse(xmlhttp.responseText);
            } catch (err) {
                console.log(err.message + " in " + xmlhttp.responseText);
                return;
            }
            callback(data);
        }
    };
/* END Copied Code */
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

ajax_get('https://api.thedogapi.com/v1/breeds', function(data) {


    for (var js2 in data) {
        jslength++;
    }
    for (var i = 0; i < jslength; i++) {
        var tempnum = (i % 10 + 1) + "";
        var html = '<input type="checkbox" id="cb' + tempnum + '" name="page1" onclick="checkboxFt()"/><label for="cb' + tempnum + '"><img src="' + data[i]["image"]["url"] + '" />' + data[i]["name"] + '</label>';
        var dogData = new dog(data[i]["name"], data[i]["image"]["url"], html, data[i]["id"]);
        dogList[i] = dogData;


    }

    for (var j = 1; j <= 10; j++) {
        document.getElementById("x" + j).innerHTML = dogList[j - 1]["image"];

    }



    console.log(dogList);




});

function nextFt() {
    var pageMax = parseInt(jslength / 10) + 1;
    var x = 0;
    if (page < pageMax) {
        page = page + 1;
        for (i = 1; i <= 10; i++) {
            x = (page - 1) * 10 + i - 1;
            try {
                document.getElementById("x" + i).innerHTML = "";
                document.getElementById("x" + i).innerHTML = dogList[x]["image"];
                if (map.get(dogList[x]["id"])) {
                    document.getElementById("cb" + i).checked = true;
                }

            } catch (err) {

            }


        }


    }

};

function preFt() {
    var x = 0;
    if (page > 1) {
        page = page - 1;
        for (i = 1; i <= 10; i++) {
            x = (page - 1) * 10 + i - 1;
            try {
                document.getElementById("x" + i).innerHTML = "";
                document.getElementById("x" + i).innerHTML = dogList[x]["image"];
                if (map.get(dogList[x]["id"])) {
                    document.getElementById("cb" + i).checked = true;
                }
            } catch (err) {

            }


        }


    }

};



function checkboxFt() {
    var y = 0;
    for (i = 1; i <= 10; i++) {
        y = (page - 1) * 10 + i - 1;
        try {
            // console.log(document.getElementById("cb" + i).checked);
            if (document.getElementById("cb" + i).checked) {
                // console.log(y + "is checked");
                if (map.get(dogList[y]["id"]) == null || map.get(dogList[y]["id"]) == "" || map.get(dogList[y]["id"]) == 'undefined') {
                    map.put(dogList[y]["id"], dogList[y]);
                    document.getElementById("breedChose").value = "You have chose: " + map.keySet();
                    // console.log(dogList[y["id"]]);

                }

            } else {
                if (map.get(dogList[y]["id"])) {
                    map.remove(dogList[y]["id"]);
                    document.getElementById("breedChose").value = "You have chose: " + map.keySet();
                    // console.log("remove the element from hashmap");
                } else {
                    // console.log(map.get(y));
                }
            }
        } catch (err) {

        }
    }
}

//Game start
function gameStart() {

    //Verify that the username is filled in
    // if (!$name.val()) {
    //     alert('Please enter your name')
    //     return
    // }

    // currName = $name.val()
    userInfo[currName] = {
        score: 0,
        // difficulty: $difficulty.val()
    }


    // $('.start-wrapper').hide()
    // $('.main-game').show()

    //Data initialization
    var userSelect = document.getElementById("selectLevel");
    var index = userSelect.selectedIndex;
    var level = userSelect.options[index].value; // 获取用户选择的游戏难度
    var j = 0;
    var dogImageArray = [];

    /* The code below was taken from a post at https://www.codenong.com/19706046/* (last accessed 2020-11-25)*/
    /*BEGIN Copied Code */
    function ajax_get(url, callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                console.log('responseText:' + xmlhttp.responseText);
                try {
                    var data = JSON.parse(xmlhttp.responseText);
                } catch (err) {
                    console.log(err.message + " in " + xmlhttp.responseText);
                    return;
                }
                callback(data);
            }
        };

        xmlhttp.open("GET", url, false);
        xmlhttp.send();
    }
    /* END Copied Code */

    function ajaxGetFunc(times) {
        if (times <= 0) {
            return;
        }
        ajax_get('https://api.thedogapi.com/v1/images/search', function(data) {
            var dogImage = data[0]["url"];
            if (dogMap.get(dogImage) == null) {
                dogMap.put(dogImage, dogImage);
                dogImageArray[j] = dogImage;
                j++;
                times--;
            }
            ajaxGetFunc(times);
        });

    }

    function ajaxGetFunc2(times, dog_id) {
        if (times <= 0) {
            return;
        }
        ajax_get('https://api.thedogapi.com/v1/images/search?breed_id=' + dog_id, function(data) {
            var dogImage = data[0]["url"];
            if (dogMap.get(dogImage) == null) {
                dogMap.put(dogImage, dogImage);
                dogImageArray[j] = dogImage;
                j++;
                times--;
            }
            ajaxGetFunc2(times, dog_id);
        });

    }

    function ajaxGetBreeds(difficulty) {
        var breedArray = map.keySet();
        console.log(breedArray)
        var breedSaver = [];
        var x;
        if (difficulty == "easy") {
            if (breedArray == null || breedArray == "") {
                ajaxGetFunc(4)
            } else {
                var y = 4 % map.keySet().length;
                for (x in breedArray) {
                    breedSaver[x] = map.get(breedArray[x]).b_id;
                    if (y == 0) {
                        ajaxGetFunc2(4 / map.keySet().length, breedSaver[x]);
                    } else if (map.keySet().length > 4) {
                        if (x < 4)
                            ajaxGetFunc2(1, breedSaver[x]);
                    } else {
                        if (x <= (y - 1)) {
                            ajaxGetFunc2(parseInt(4 / map.keySet().length) + 1, breedSaver[x]);
                        } else {
                            ajaxGetFunc2(parseInt(4 / map.keySet().length), breedSaver[x]);
                        }


                    }

                }
            }

        } else if (difficulty == "medium") {
            if (breedArray == null || breedArray == "") {
                ajaxGetFunc(6)
            } else {
                var y = 6 % map.keySet().length;
                for (x in breedArray) {
                    breedSaver[x] = map.get(breedArray[x]).b_id;
                    console.log(breedSaver[x])
                    if (y == 0) {
                        ajaxGetFunc2(6 / map.keySet().length, breedSaver[x]);
                    } else if (map.keySet().length > 6) {
                        if (x < 6)
                            ajaxGetFunc2(1, breedSaver[x]);
                    } else {
                        if (x <= (y - 1)) {
                            ajaxGetFunc2(parseInt(6 / map.keySet().length) + 1, breedSaver[x]);
                        } else {
                            ajaxGetFunc2(parseInt(6 / map.keySet().length), breedSaver[x]);
                        }


                    }

                }
            }
        } else {
            if (breedArray == null || breedArray == "") {
                ajaxGetFunc(9)
            } else {
                var y = 9 % map.keySet().length;
                for (x in breedArray) {
                    breedSaver[x] = map.get(breedArray[x]).b_id;
                    if (y == 0) {
                        ajaxGetFunc2(9 / map.keySet().length, breedSaver[x]);
                    } else if (map.keySet().length > 9) {
                        if (x < 9)
                            ajaxGetFunc2(1, breedSaver[x]);
                    } else {
                        if (x <= (y - 1)) {
                            ajaxGetFunc2(parseInt(9 / map.keySet().length) + 1, breedSaver[x]);
                        } else {
                            ajaxGetFunc2(parseInt(9 / map.keySet().length), breedSaver[x]);
                        }


                    }

                }
            }

        }
    }

    const grid = document.querySelector('.grid')
    const resultDisplay = document.querySelector('#score')
    var cardsChosen = []
    var cardsChosenId = []
    var cardsWon = []
        //timer
    sec = 31
    counter();
    //create your board
    /* The code below was taken from a post at https://github.com/kubowania/memory-game/blob/master/app.js (last accessed 2021-02-19)*/
    /*BEGIN Copied Code */
    function createBoard() {
        for (var i = 0; i < cardArray.length; i++) {
            const card = document.createElement('img')
            card.setAttribute('src', 'images/blank.png')
            card.setAttribute('data-id', i)
            card.className = 'Cardimg'
            card.addEventListener('click', flipCard)
            grid.appendChild(card)
        }
    }

    //check for matches
    function checkForMatch() {
        const cards = document.querySelectorAll('.Cardimg')
        const optionOneId = cardsChosenId[0]
        const optionTwoId = cardsChosenId[1]

        if (optionOneId == optionTwoId) {
            cards[optionOneId].setAttribute('src', 'images/blank.png')
            cards[optionTwoId].setAttribute('src', 'images/blank.png')
            alert('You have clicked the same image!')
        } else if (cardsChosen[0] === cardsChosen[1]) {
            alert('You found a match')
            cards[optionOneId].setAttribute('src', 'images/white.png')
            cards[optionTwoId].setAttribute('src', 'images/white.png')
            cards[optionOneId].removeEventListener('click', flipCard)
            cards[optionTwoId].removeEventListener('click', flipCard)
            cardsWon.push(cardsChosen)
        } else {
            cards[optionOneId].setAttribute('src', 'images/blank.png')
            cards[optionTwoId].setAttribute('src', 'images/blank.png')
            alert('Sorry, try again')
        }
        cardsChosen = []
        cardsChosenId = []
        resultDisplay.textContent = cardsWon.length
        userInfo[currName].score = cardsWon.length
        if (cardsWon.length === cardArray.length / 2) {
            resultDisplay.textContent = 'Congratulations! You found them all!'
            alert("Congratulations! You finished the game!!")
            quit()
        }
    }

    //flip your card
    function flipCard() {
        var cardId = this.getAttribute('data-id')
        cardsChosen.push(cardArray[cardId].name)
        cardsChosenId.push(cardId)
        this.setAttribute('src', cardArray[cardId].img)
        if (cardsChosen.length === 2) {
            setTimeout(checkForMatch, 500)
        }
    }
    /* END Copied Code */
    /* easy game */
    if (level == "easy") {
        document.getElementById('grid').innerHTML = ' ';
        // ajaxGetFunc(4);
        ajaxGetBreeds("easy")

        console.log(dogImageArray);

        var cardArray = [{
                name: 'pic1',
                img: dogImageArray[0]
            },
            {
                name: 'pic2',
                img: dogImageArray[1]
            },
            {
                name: 'pic3',
                img: dogImageArray[2]
            },
            {
                name: 'pic4',
                img: dogImageArray[3]
            },

            {
                name: 'pic1',
                img: dogImageArray[0]
            },
            {
                name: 'pic2',
                img: dogImageArray[1]
            },
            {
                name: 'pic3',
                img: dogImageArray[2]
            },
            {
                name: 'pic4',
                img: dogImageArray[3]
            },
        ]

        console.log(cardArray);

        cardArray.sort(() => 0.5 - Math.random()) // 随机排序


        createBoard()

    }
    /* normal game */
    else if (level == "medium") {
        document.getElementById('grid').innerHTML = ' ';
        // ajaxGetFunc(6);
        ajaxGetBreeds("medium")

        console.log(dogImageArray);

        var cardArray = [{
                name: 'pic1',
                img: dogImageArray[0]
            },
            {
                name: 'pic2',
                img: dogImageArray[1]
            },
            {
                name: 'pic3',
                img: dogImageArray[2]
            },
            {
                name: 'pic4',
                img: dogImageArray[3]
            },
            {
                name: 'pic5',
                img: dogImageArray[4]
            },
            {
                name: 'pic6',
                img: dogImageArray[5]
            },
            {
                name: 'pic1',
                img: dogImageArray[0]
            },
            {
                name: 'pic2',
                img: dogImageArray[1]
            },
            {
                name: 'pic3',
                img: dogImageArray[2]
            },
            {
                name: 'pic4',
                img: dogImageArray[3]
            },
            {
                name: 'pic5',
                img: dogImageArray[4]
            },
            {
                name: 'pic6',
                img: dogImageArray[5]
            }
        ]

        console.log(cardArray);

        cardArray.sort(() => 0.5 - Math.random()) // 随机排序

        createBoard()

    } else {
        /* hard game */
        document.getElementById('grid').innerHTML = ' ';
        // ajaxGetFunc(9);
        ajaxGetBreeds("hard")

        console.log(dogImageArray);

        var cardArray = [{
                name: 'pic1',
                img: dogImageArray[0]
            },
            {
                name: 'pic2',
                img: dogImageArray[1]
            },
            {
                name: 'pic3',
                img: dogImageArray[2]
            },
            {
                name: 'pic4',
                img: dogImageArray[3]
            },
            {
                name: 'pic5',
                img: dogImageArray[4]
            },
            {
                name: 'pic6',
                img: dogImageArray[5]
            },
            {
                name: 'pic7',
                img: dogImageArray[6]
            },
            {
                name: 'pic8',
                img: dogImageArray[7]
            },
            {
                name: 'pic9',
                img: dogImageArray[8]
            },
            {
                name: 'pic1',
                img: dogImageArray[0]
            },
            {
                name: 'pic2',
                img: dogImageArray[1]
            },
            {
                name: 'pic3',
                img: dogImageArray[2]
            },
            {
                name: 'pic4',
                img: dogImageArray[3]
            },
            {
                name: 'pic5',
                img: dogImageArray[4]
            },
            {
                name: 'pic6',
                img: dogImageArray[5]
            },
            {
                name: 'pic7',
                img: dogImageArray[6]
            },
            {
                name: 'pic8',
                img: dogImageArray[7]
            },
            {
                name: 'pic9',
                img: dogImageArray[8]
            },
        ]

        console.log(cardArray);

        cardArray.sort(() => 0.5 - Math.random()) // 随机排序

        createBoard()
    }
}

function quit() {
    // $('.start-wrapper').show()
    // $('.main-game').hide()


    //Stop the countdown clock
    clearInterval(timer)

    //Update the current user's score in userInfo
    // userInfo[currName].score = cardsWon.length

    document.getElementById('grid').innerHTML = ' ';
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
        //render top10 player
    renderTop10()
    map = new HashMap();
    dogImageArray = [];
    dogMap = new HashMap();
}


// Some random colors
const colors = ["#3CC157", "#2AA7FF", "#1B1B1B", "#FCBC0F", "#F85F36"];

const numBalls = 50;
const balls = [];

for (let i = 0; i < numBalls; i++) {
    let ball = document.createElement("div");
    ball.classList.add("ball");
    ball.style.background = colors[Math.floor(Math.random() * colors.length)];
    ball.style.left = `${Math.floor(Math.random() * 100)}vw`;
    ball.style.top = `${Math.floor(Math.random() * 100)}vh`;
    ball.style.transform = `scale(${Math.random()})`;
    ball.style.width = `${Math.random()}em`;
    ball.style.height = ball.style.width;

    balls.push(ball);
    document.body.append(ball);
}


// Keyframes
balls.forEach((el, i, ra) => {
    let to = {
        x: Math.random() * (i % 2 === 0 ? -11 : 11),
        y: Math.random() * 12
    };

    let anim = el.animate(
        [
            { transform: "translate(0, 0)" },
            { transform: `translate(${to.x}rem, ${to.y}rem)` }
        ], {
            duration: (Math.random() + 1) * 2000, // random duration
            direction: "alternate",
            fill: "both",
            iterations: Infinity,
            easing: "ease-in-out"
        }
    );
});


//Timer
/* The code below was taken from a post at https://www.freecodecamp.org/news/javascript-timers-everything-you-need-to-know-5f31eaa37162/ (last accessed 2020-11-25)*/
/*BEGIN Copied Code */
function counter(resetWidth = true) {
    if (timer) { clearInterval(timer) }

    //Count down starts, initialize the progress bar
    // if (resetWidth) { $counter.width('100%') }
    // $counter.css('background', '#67C23A')

    // Change the length of the progress bar every second
    timer = setInterval(() => {
        sec = sec - 1
        // $counter.width(((sec / 30) * 100) + '%')
        // $('.time-left').text(sec)

        //Only 10 seconds left, the color turns red
        // $counter.css('background', sec <= 10 ? '#F56C6C' : '#67C23A')

        //Time is up, failure
        if (sec === 0) {
            clearInterval(timer)
            alert('Time is up')
            quit()
        }
    }, 1000);
}
/* END Copied Code */

function renderTop10() {
    //Sorted by the score of each user in userInfo
    var arr = Object.entries(userInfo).sort((b, a) => a[1].score - b[1].score)
        //Get top10
    if (arr.length > 10) {
        arr.length = 10
    }
    var s = ''
    arr.forEach((v, idx) => {
        s += `<tr><td>${ idx + 1 }</td> <td>${ v[0] }</td> <td>${ v[1].score }</td> <td>${ v[1].difficulty }</td></tr>`
    })
    // $('.top10').html(s)
}