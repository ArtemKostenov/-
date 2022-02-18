//forvo api key:b04a284c5d3bf50c72b78876cd8d5a1e
var wordGame = angular.module('wordGame', []);


//this controller covers the main board functions
wordGame.controller('GameCtrl', ['$scope', '$interval', function ($scope, $interval) {

    var total_time = 0; //holds value of time in total centiSecond. (1/10 sec)
    var timer = null; //varialble to hold the running timer
    $scope.game_phase = "not_yet_started"; //not_yet_started stands for phase when game is yet to begin,vwaiting stands for waiting of game that will be on the begining of the game before game start triggered and at begining of new word when the original word'/hint is displaying., playing stands for running game , paused stands for paused mode of game 
    $scope.time_min = 0;
    $scope.time_sec = 0;
    $scope.time_csec = 0;
    $scope.play_pause_button_text = "Pause";
    $scope.current_word_index = 0;
    $scope.total_score = 0;
    $scope.words = [{
        spell: "Gandalf",
        mean: "Был серый, стал белый."
    }, {
        spell: "Gimli",
        mean: "Потомок Дурина по младшей линии."
    }, {
        spell: "Aragorn",
        mean: "Наследник Исильдура."
    }, {
        spell: "Frodo",
        mean: "Выдающийся хоббит из Шира."
    }, {
        spell: "Bilbo",
        mean: "Дядя выдающегося хоббита из Шира."
    }, {
        spell: "Sauron",
        mean: "Тёмный властелин."
    }, {
        spell: "Saruman",
        mean: "Маг, перешедший на сторону зла."
    }, {
        spell: "Boromir",
        mean: "Первый страж Цитадели."
    }, {
        spell: "Gollum",
        mean: "Моя прелесть"
    }, {
        spell: "Legolas",
        mean: "Один из основных персонажей, которому более 500 лет."
        }, {
            spell: "Azog",
        mean: "Орк убивший отца Торина."
        }, {
            spell: "Ungoliant",
        mean: "Прародительница всех гигантскаих пауков."
        }, {
            spell: "Shelob",
        mean: "Страж тайного прохода к роковой горе."
        }, {
            spell: "Illuvatar",
        mean: "Бог."
        }, {
            spell: "Morgot",
        mean: "Главный из падших айнур."
        }, {
            spell: "Balrog",
        mean: "Один из элитных войнов Мелькора."

    },];
    $scope.total_words = $scope.words.length;
    var suffle_array = function (array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;
        console.log("suffle_array fired");
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            if (currentIndex == 1) array[0].spell = array[0].spell.trim().toUpperCase();
            array[currentIndex].spell = array[currentIndex].spell.trim().toUpperCase();
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
    };

    //starts time only when one "timer" is not running
    //if the timer is already running, it wont trigger again.
    start_timer = function () {
        console.log("start_timer fired");
        if (timer == null) {
            timer = $interval(function () {
                total_time += 1;
                $scope.time_csec = total_time % 10;
                $scope.time_sec = Math.floor(total_time / 10) % 60;
                $scope.time_min = Math.floor(total_time / 600);
                $scope.$broadcast('update_progress_bar', total_time);
            }, 250);
        }
    };

    //Stops the timer
    stop_timer = function () {
        console.log("pause_timer fired");
        if (timer != null) {
            $interval.cancel(timer);
            timer = null;
        }
    };

    //This function resumes up the game by executing following
    play_it = function () {
        start_timer(); //starts timer
        $scope.game_phase = "playing"; //sets the game_pahse too 'playing'
        $scope.$broadcast('resume_up_tile'); //Reload tiles by broadcasting to child
        $scope.$broadcast('add_active_to_progressbar', total_time); //sets strip of progressbar run
        $scope.play_pause_button_text = "Pause";

    };
    //Executes the required function to make game still
    pause_it = function () {
        stop_timer();
        $scope.game_phase = "paused";
        $scope.$broadcast('turn_tile_blank');
        $scope.$broadcast('remove_active_of_progressbar');
        $scope.$broadcast('reset_progress_bar');
        $scope.play_pause_button_text = "Resume";
    };

    //and function called when play_pause is clicked, it resumes game if it was paused, and it pauses game if it was in playing
    $scope.play_pause = function () {
        console.log("play_pause fired");
        var e = document.getElementById("play_pause_btn");
        if ($scope.game_phase == "paused") {
            $scope.flip(e, "btn_play");
            e.className = e.className.replace(" btn-success", " btn-warning");
            e.innerHTML = ' <font size="5px"><span class="glyphicon glyphicon-pause" ></span><font color="#2E2E2E">Pause</font></font>';
            play_it();
        } else if ($scope.game_phase == "playing") {
            $scope.flip(e, "btn_pause");
            e.className = e.className.replace(" btn-warning", " btn-success");
            e.innerHTML = '<font size="5px"><span class="glyphicon glyphicon-play" ></span><font color="#2E2E2E">Resume</font></font>';
            pause_it();
        }

    };

    //keep an eye on $scope.game_phase, when ever it gets changed broadcasts 'accept_phase'
    $scope.$watch('game_phase', function () {
        $scope.$broadcast('accept_phase', $scope.game_phase);
    });

    //Entry point of game, fires when start button is clicked
    $scope.start_game = function () {
        console.log("start_game fired");
        suffle_array($scope.words);
        $scope.game_phase = "playing";
        start_timer();
        $scope.current_word_index = 0;
        //fire a call to wordCtrl
        $scope.$broadcast('start_game_from_0');
    };

    //Ends the game and shows the final score.
    $scope.terminate_game = function () {
        alert("Hellow, your word score is:" + $scope.total_score + "\n\nReport this score before closing this");
        location.reload();
    }

    //flips the element and sets the background color according to type.

    $scope.flip = function (e, type) {
        var time_req = '0.4'

        switch (type) {
            case "true":
                //when correct tile is clicked
                flip_color = '#ABD0A5';
                break;

            case "false":
                //when wrong tile is clicked
                flip_color = '#D0A5A5';
                break;
            case "reset":
                //When all tiles are loaeded with new fresh options
                flip_color = "#6884CC";
                break;

            case "pause":
                //When game goes pause, this apply to all tile
                flip_color = "silver";
                break;
            case "hint":
                //When hint tile is clicked
                flip_color = "#64A55A";
                break;
            case "btn_pause":
                //When pause button is clicked
                flip_color = "#ABD0A5"
                break;
            case "btn_play":
                //When play button is clicked
                flip_color = "#f0ad4e"
                break;
            case "btn_start":
                //when start button is clicked
                flip_color = "#ABD0A5"
                break;
            case "word_conter":
                flip_color = "#e1e1e1"
                break;
        }
        e.style.background = flip_color;
        if (e.style.webkitAnimationName != 'flip_tile') {
            e.style.webkitAnimationName = 'flip_tile';
            e.style.webkitAnimationDuration = time_req + 's';
            if (type != "btn_pause" && type != "btn_play") e.style.background = flip_color;
            setTimeout(function () {
                e.style.webkitAnimationName = '';
            }, time_req * 1000);
        }
    };

    //Filp the image div and set the new  image for new word.
    $scope.show_word = function () {
        var hint_place = document.getElementById("hint_place");
        $scope.flip(hint_place, "hint");
        $scope.flip(document.getElementById("div_rb_counter"), "word_conter");
        $scope.show_hint(2);
        pause_it();
        $scope.game_phase = "waiting";
        setTimeout(function () {
            $scope.game_phase = "playing";
            hide_hint();
            var e = document.getElementById("play_pause_btn");
            e.disabled = false;
            play_it();
        }, 2000);
    }

    //If game is in playing mode. It Displays a correct word on hint tile. 
    //If game is paused , Game is not suppose to showup a hint word.
    $scope.show_hint = function (seconds) {
        var e = document.getElementById("hint_place");
        console.log("show_hint fired");

        if ($scope.game_phase == "playing" || $scope.game_phase == "waiting") {
            e.style.lineHeight = "40px";
            e.innerHTML = '<font size="5px" color="silver">Word is:</font><br/><font size="8px" color="white"><b>' + $scope.words[$scope.current_word_index].spell + '</b></font>';
            $scope.$broadcast('speak', $scope.words[$scope.current_word_index].spell);
        } else if ($scope.game_phase != "not_yet_started") {
            e.style.lineHeight = "40px";
            e.innerHTML = "<font size='5px' color='white'><br/>Game Paused <br/><small>Click 'Resume' button to resume</small></font>";
        }
        setTimeout(function () {
            hide_hint();
        }, (seconds) * 1000);
    };

    //Flip the hint tile and hide the hint on it.
    function hide_hint() {
        if ($scope.game_phase != 'not_yet_started') {
            var e = document.getElementById("hint_place");
            e.style.lineHeight = "18px";
            e.innerHTML = '<font size="4px" color="silver"><p style="margin-bottom:5px;">Spell a word that stands for following meaning</font><br/></p><font size="5px" color="white">' + $scope.words[$scope.current_word_index].mean + '</font><font color="#e1e1e1" size="4px"><br/><div id="show_hint_div class="show_word_box"> <button id="show_word_box" type="button" class="btn btn-warning btn-lg show_word_box" onclick="show_hint_up(1.5);" onmouseover="show_hint_up(1.5);"><font size="4px><span class="glyphicon glyphicon-info-sign" ></span><font color="#2E2E2E">Find your word here...</font></font></button></div>';
            $scope.flip(e, "hint");

        }
    }

    //A local method to fire $scope mathod
    show_hint_up = function (time) {
        console.log("in show_hint_up with phase" + $scope.game_phase);
        $scope.show_hint(time);
    };


    //$on zone
    //All the listen on even from child are listed here
    $scope.$on('flip', function (event, element, type) {
        $scope.flip(element, type);
    });

    $scope.$on('up_score_by', function (event, char_score) {
        $scope.total_score += char_score;
    });

    $scope.$on('get_current_time', function (event, type) {
        if (type == "start_time") {
            console.log("sending start time:" + total_time);
            $scope.$broadcast('accept_start_time', total_time);
        } else if (type == "end_time") {
            console.log("sending end time:" + total_time);
            $scope.$broadcast('accept_end_time', total_time);
        }
    });
}]);


//This controller is child of the GameSession. Will handle the operations at level of words,
wordGame.controller('WordCtrl', ['$scope', function ($scope) {
    var current_char_index;
    var current_spell;
    var speak_lock = false;
    var my_frame = document.getElementById("audio_frame");
    
    //loads new word
    load_word = function () {
        current_spell = $scope.$parent.words[$scope.$parent.current_word_index].spell;
        // speak(current_spell);
        console.log("load_new_word fired with word " + current_spell);
        current_char_index = 0;
        $scope.$parent.show_word();
        setTimeout(function () {
            load_subword()
        }, 2000);
    }

    //pronunciate a word
    speak = function (word, time) {
        var lock_period; //sets a lock on speak function, so no other speak
        if (time == 0) lock_period = 800;
        else lock_period = time * (word.length) / 2;
        if (!speak_lock) {
            speak_lock = true;
            my_frame.src = "http://translate.google.com/translate_tts?tl=en&q=" + word;
            setTimeout(function () {
                speak_lock = false;
            }, lock_period);
        }
    }

    //load subword
    //say for a word 'apple'-> 'a','ap','app','appl','apple' are the subwords
    load_subword = function () {
        var sub_word = current_spell.slice(0, current_char_index + 1);
        console.log(sub_word);
        $scope.$broadcast('prepare_board_for', sub_word); //Trigger child to prepare board for given sub word
    };


    //When a one word is completed , it checks if all words in a game are completed or not
    //If all words are covered , it will terminate the game
    //otherwise it will fire load_word to load new word
    word_done = function () { 
        if (++$scope.$parent.current_word_index == $scope.$parent.words.length) {
            $scope.$parent.terminate_game();
        } else {
            load_word();
        }
    };

    //$on zone. All the listner of parent/child broadcast/emit are here
    //Childe emits this when correct of for subword is selected,
    //this function will check if all cahracters are done or not.
    //If done then it fire word_done other wise it fires load_subword
    $scope.$on("char_done", function (event) {
        current_char_index++;
        if (current_char_index == current_spell.length) {
            word_done();
        } else {
            load_subword();
        }
    });

    //Parent will broadcast this when start button will be clicked.
    $scope.$on('start_game_from_0', function (event) {
        load_word();
    });

    //On speaking of word
    $scope.$on('speak', function (event, word) {
        speak(word, 0);
    });
    //When wrong option is clicked, all charcter should be prononciated
    $scope.$on('speak_chars', function (event) {
        var word = current_spell;
        word = word.split("").join("-");
        speak(word, 350);
    });

}]);

//This scope is child scope of the WordSession. Will handle the operations at level of character,

wordGame.controller('CharCtrl', ['$scope', function ($scope) {
    var sub_word = '';
    var char_time_start = 0,
        char_time_end = 0;
    $scope.time_diff = 0;
    $scope.tile = ['', '', '', '', '', '', '', '', ''];
    $scope.phase;

    //Set subword options
    prepare_board_for_subword = function () {
        $scope.$emit('get_current_time', 'start_time');
        $scope.tile = get_options_for_subword();
        turn_all_tile("reset");
    };

    //generates options for subword
    //option=base_sub_word+character_option
    //base subword is the part of subword which remain same in all the options.
    //say sub_word 'appl' have 'appe','appq','appv','appl','appx'..... options
    //Here 'app' is base_sub_word and e,q,v,l,x.... are the cahracter_options
    get_options_for_subword = function () {
        var random_list = sub_word.charAt(sub_word.length - 1);
        while (random_list.length < 9)
        random_list = random_list + get_new_valid_char(random_list);
        return get_joined_option_array(sub_word, random_list.shuffle());
    };

    //Last char of all option must be differnt
    //This get the character 
    get_new_valid_char = function (random_list) {
        var temp_char, temp_ascci;
        while (true) {
            temp_ascci = Math.floor(Math.random() * 25 + 65);
            temp_char = String.fromCharCode(temp_ascci);
            if (random_list.indexOf(temp_char) == -1) return temp_char;
        }
    };

    //suffle the charcters within word
    String.prototype.shuffle = function () {
        var a = this.split(""),
            n = a.length;
        for (var i = n - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
        }
        return a.join("");
    };

    //joins base_sub_word and characater_option
    get_joined_option_array = function (sub_word, random_list) {
        var subword_options = [],
            new_word;
        for (var i = 0; i < 9; i++) {
            new_word = sub_word.slice(0, sub_word.length - 1) + random_list.charAt(i);
            subword_options.push(new_word);
        }
        return subword_options;
    };

     //When some tile is clicked,it checks if the clicked tile is correct tile or not.
    //If its correct, will flip true and new set of character will be loaded 
    //if its not correct then, it will flip false and set red.
    $scope.check_me = function (id) {
        console.log("Phase found is:" + $scope.phase);
        if ($scope.phase == "playing") {
            if ($scope.tile[id] == sub_word) {
                $scope.$emit('flip', document.getElementById(id), "true");
                setTimeout(function () {
                    char_done();
                }, 500);
            } else {
                $scope.$emit('flip', document.getElementById(id), "false");
                $scope.$emit('speak_chars');
            }
        }
    };

    //returns a score for character 
    //will be calculated on bases of start and end time
    function get_char_score() {
        $scope.time_diff = char_time_end - char_time_start;
        if ($scope.time_diff <= 20) return 100;
        else if ($scope.time_diff <= 38) return 70;
        else if ($scope.time_diff <= 56) return 30;
        else return 10;
    }


    //If the correct tile is clicked, it fires this
    char_done = function () {
        //console.log("charCtrl->char_done()");
        $scope.$emit('get_current_time', 'end_time');
        //console.log(char_time_end +" vs "+ char_time_start);
        $scope.$emit('up_score_by', get_char_score());
        $scope.$emit('char_done');
    };



    //set the progress bar as per the time goes on.
    update_progress_bar = function (total_time) {
        var diff = total_time - char_time_start;
        var bar, percent;
        if (diff < 18) {
            bar = document.getElementById("bar_one");
            document.getElementById("bar_two").style.width = "28%";
            document.getElementById("bar_three").style.width = "28%";
            percent = 30 * (17 - diff) / 18;
            //console.log(percent);
            bar.style.width = percent + "%";
        } else if (diff <= 36) {
            diff = diff - 18;
            bar = document.getElementById("bar_two");
            document.getElementById("bar_three").style.width = "28%";
            percent = 30 * (17 - diff) / 18;
            bar.style.width = percent + "%";
        } else if (diff <= 54) {
            diff = diff - 36;
            bar = document.getElementById("bar_three");
            percent = 30 * (18 - diff) / 18;
            bar.style.width = percent + "%";
        }
    }

    //reset the progress bar to 100 points
    reset_progress_bar = function () {
        document.getElementById("bar_two").style.width = "28%";
        document.getElementById("bar_three").style.width = "28%";
        document.getElementById("bar_one").style.width = "28%";
        document.getElementById("bar_four").style.width = "16%";
    }

    //adds the activeness to progress bar
    add_active_to_progressbar = function () {
        document.getElementById("bar_one").className += " progress-bar-striped active";
        document.getElementById("bar_two").className += " progress-bar-striped active";
        document.getElementById("bar_three").className += " progress-bar-striped active";
        document.getElementById("bar_four").className += " progress-bar-striped active";
    }

    //this function stops the time bar from moving strips
    remove_active_of_progressbar = function () {
        document.getElementById("bar_one").className = "progress-bar progress-bar-success my_bar";
        document.getElementById("bar_two").className = "progress-bar progress-bar-info my_bar";
        document.getElementById("bar_three").className = "progress-bar progress-bar-warning  my_bar"
        document.getElementById("bar_four").className = "progress-bar progress-bar-danger  my_bar"
    }

    //it applies filp to all tiles with type as param
    turn_all_tile = function (type) {
        for (var i = 0; i < 9; i++) {
            var id = '' + i;
            $scope.$emit('flip', document.getElementById(id), type);
        }
    };

    //apllies hover effect to child
    child_hover = function (e) {
        if ($scope.phase == "playing") {
            e.style.color = "#E2E2E2";
            e.style['-webkit-box-shadow'] = "2px 2px 3px #2E2e2e";
        }
    }

    //Removes the hover effect after mouse is out
    child_mouse_out = function (e) {
        e.style.color = "white";
        e.style.textDecoration = 'none';
        e.style['-webkit-box-shadow'] = "none";
    }

    //$on zone, listen of all $broadcast of parent
    $scope.$on('turn_tile_blank', function (event) {
        $scope.tile = ['', '', '', '', '', '', '', '', ''];
        turn_all_tile("pause");
    });

    $scope.$on('resume_up_tile', function (event) {
        prepare_board_for_subword();
    });

    $scope.$on('prepare_board_for', function (event, temp_sub_word) {
        console.log("catch prepare_board_for " + temp_sub_word);
        sub_word = temp_sub_word;
        prepare_board_for_subword();
    });

    $scope.$on('accept_start_time', function (event, time) {

        char_time_start = time;
        console.log("start time set as " + char_time_start);
    });

    $scope.$on('accept_end_time', function (event, time) {
        char_time_end = time;
    });

    $scope.$on('reset_progress_bar', function (event) {
        reset_progress_bar();
    });


    $scope.$on('update_progress_bar', function (event, total_time) {
        update_progress_bar(total_time);
    });


    $scope.$on('remove_active_of_progressbar', function (event) {
        remove_active_of_progressbar();
    });

    $scope.$on('add_active_to_progressbar', function (event) {
        add_active_to_progressbar();
    });

    $scope.$on('accept_phase', function (event, current_pahse) {
        $scope.phase = current_pahse;
    });
}]);
