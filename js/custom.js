// Custom code I use for my project
 /////// ANSWER /////// 
 // (separated as when game ends, all other JS is deleted!) 
    function answer() {
        var answers = ['Ned Kelly', 'ned kelly', 'Ned kelly', 'ned Kelly', 'Kelly', 'kelly', 'Ned', "ned", 'NedKelly', "nedkelly"];
        var answerValue = document.getElementById("answerValue").value;
        var answerCheck = answers.includes(answerValue);

        // If x is Not a Number or less than one or greater than 10
        if (answerCheck) {
        text = "Congratulations! Ned Kelly is the correct answer. To find out more about his life, click on the 'ANSWER' link above. Thank you for playing.";      
        } else {
            text = "Sorry, that is not the correct answer. Please refresh the page and try again!";
        }
      document.getElementById("answer").innerHTML = text;
    }


// Component to Ned Kelly Logic
AFRAME.registerComponent('nedkelly-logic', {
    init: function () {
        

        // Defined items for easier referencing
        var el = this.el;
        
        var nedkelly = document.querySelector('#nedkelly');
        nedkelly.setAttribute("animation-mixer", {clip: "idleStill"});
        
        var police = document.querySelector('#police');
        police.setAttribute("animation-mixer", {clip: "idle"});
        
        var scene = document.querySelector('a-scene');
        var cam = document.querySelector('#cam');
        var nedcollider = document.querySelector('#nedcollider');
        var blackOut = document.querySelector('#blackout');
        var score = document.querySelector('#score');
        
        // Hints
        var helmet =  document.querySelector('#helmet');
        var scarf = document.querySelector('#scarf');
        var scarfcollider = document.querySelector('#scarfcollider');
      
        //audio
        var audio = new Audio('./audio/folksey-mixkit.mp3');
        var audio2 = new Audio('./audio/folksey-mixkit-underwater.mp3');
        var audio3 = new Audio('./audio/gunshot.mp3');
        
        // Messages 
        var trigger = document.querySelectorAll(".trigger");
        var adeath = document.querySelector('#death');
        var highscore = document.querySelector("#highscore");
        
        // Scpre
        var interval;
        var totalScore = 0;
        
        var death = true;

        // The far more complicated version of parenting the camera to Ned Kelly's head. First calling the skinned mesh THEN the skeleton. This was hands down the hardest thing to implement. I not only needed to learn Javascript and Aframe but also the fundamentals of three.js.
        nedkelly.addEventListener('model-loaded', function(event){
            const model = event.detail.model;
            const skinnedMesh = model.getObjectByName('nedKelly001');
            skinnedMesh.skeleton.bones[2].add(cam.object3D);
            skinnedMesh.skeleton.bones[2].add(nedcollider.object3D);
        });
        
        // Method to stop multi-touch affecting up the breathing mechanic 
        var killmulti = 0;

        // Code to start the game.
        var start = document.querySelector('#start');
        start.addEventListener("click", startGame);
        function startGame() {
            document.querySelectorAll(".menu").forEach(e => e.parentNode.removeChild(e));
            trigger.forEach(e => e.classList.add("clickable"));
            death = true;

            function Question() {
               question.style.opacity = 1;
                return;
            }

            function sceneRemove() {
                blackOut.style.pointerEvents="all";
                scene.remove();
                return;
            }


            /////// HIGH SCORE ///////
            interval = setInterval(setTime, 1000);
            


            function hints(){
                if (totalScore == 50) {
                    scarf.setAttribute('visible', true);
                    scarf.setAttribute("animation-mixer", {clip: "fall", loop:"once"});
                    scarfcollider.classList.add("clickable");
                }
                
                scarf.addEventListener('animation-finished', function() {
                   scarf.setAttribute("animation-mixer", {clip: "sway", loop:"repeat"})
                });
                
                if (totalScore == 100) {
                    helmet.setAttribute('visible', true);
                    helmet.setAttribute("animation-mixer", {clampWhenFinished: "true", loop:"once"});
                }
                return;
            }                     


            function setTime() {
                ++totalScore;
                score.innerHTML = pad(totalScore);
                hints();
            }
   

            function pad(val) {
                var valString = val + "";
                return valString;
            }
            


            /////// GAME OVER CODE ///////        
             function gameover(){
                 audio.pause();
                 audio2.pause();
                 // Removes pesky text you see when looking around by calling their "a-text" class
                 document.querySelectorAll(".a-text").forEach(e => e.parentNode.removeChild(e));
                 adeath.setAttribute('visible', true);
                 el.removeEventListener('pointerdown', crouchingdown);
                 el.removeEventListener('pointerup', crouchingup);
                 police.setAttribute("animation-mixer", {clip: "shootAt", crossFadeDuration: ".2", clampWhenFinished: "true", loop:"once"});
                 nedkelly.removeAttribute("animation-mixer");
                 nedkelly.setAttribute("animation-mixer", {clip: "dying", crossFadeDuration: ".2", loop:"once", clampWhenFinished: "true"});
                 clearInterval(interval);
                 var text = document.createTextNode('You survived for: ' + totalScore + ' seconds.');
                 highscore.appendChild(text);
                 document.getElementById("a_cam").setAttribute("look-controls","pointerLockEnabled: false");
                 blackOut.style.opacity = 1;
                 setTimeout(Question,1000);
                 setTimeout(sceneRemove,6000);
                 return;
            }   

            /////// NED KELLY LOGIC ///////

            // Air Vairables
            var air = document.querySelector('#air');
            var losingairInterval, gainingairInterval;

            // Default animation for Ned Kelly
            nedkelly.setAttribute("animation-mixer", {clip: "idleStill"});


            // Drowning Mechanic
            function drowning() {
                if (air.value <= 0) {
                    clearInterval(losingairInterval);
                    gameover();
                } else {
                    air.value--;
                }
            }

            // Breathing Mechanic
            function gainingair() {
                if (air.value == 100) {
                    clearInterval(gainingairInterval);
                } else {
                    air.value++;
                }
            }

            // Delay for audio as animation is slow
            var delay = 450;

            // Code to crouch Ned Kelly
            function crouchingdown() {
                killmulti++;  
                if (killmulti === 1) {
                    nedkelly.setAttribute("animation-mixer", {clip: "crouchDown", crossFadeDuration: ".2", loop: "once", clampWhenFinished: "true"});
                    clearInterval(gainingairInterval);
                    losingairInterval = setInterval(drowning, 200);
                    death = false;
                    audio.play();
                    audio2.play();
                    audio.loop = true;
                    audio2.loop = true;
                    audio.volume = 0;
                    audio2.volume = 0.2;
                }


            }

            // Code to surface Ned Kelly
            function crouchingup() {
                killmulti--;
                if (killmulti < 1) {
                    audio.volume = 0.2;
                    audio2.volume = 0;
                    nedkelly.removeAttribute("animation-mixer");
                    nedkelly.removeAttribute("animation-mixer");
                    nedkelly.setAttribute("animation-mixer", {clip: "idleStill", crossFadeDuration: ".4", loop:"repeat", clampWhenFinished: "true"});
                    clearInterval(losingairInterval);
                    gainingairInterval = setInterval(gainingair, 400);
                    death = true;
                }


                if (audio2.volume == 0.2 && killmulti == 0){
                        audio.volume = 0.2;
                        audio2.volume = 0;
                }


                // If kill case 1: If player goes up while Police is looking. If so, shoot player. This works in all instances UNLESS the player never ducked

                if (police.getAttribute("animation-mixer").clip === "idleAt"){
                     gameover();
                }

            }

            // Crouch Controls
            el.addEventListener('pointerup', crouchingup);
            el.addEventListener('pointerdown', crouchingdown);


            /////// POLICEMAN LOGIC ///////

            // Determines the random idles for Policeman
            var idlespolice = ["idleLooking", "idleMoving", "idle"];
            var randomidlespolice = "idle";
            var shoot = "shootAt";

            // Speed variable increases difficulty overtime
            var speed = 1;

            var randomturning = "turningLeft";
            var turning = ["turningLeft", "turningRight"];

            // Default animation for Policeman
            police.setAttribute("animation-mixer", {clip: randomidlespolice});

            // animation helpers - Simplifies the Policeman's turning logic
            var animations = [randomidlespolice, randomturning, "idleAt" ];
            var clipId = 0;

            // Idle counter (to determine when to turn around)
            var counter = 0;

            // Number used when to turn around between 1 & 3 idles
            function randomIntFromInterval(min, max) { // min and max included
                return Math.floor(Math.random() * (max - min + 1) + min);
            }

            var countertrigger = randomIntFromInterval(1,3);

            // upon each animation loop...
            police.addEventListener('animation-loop', function() {

                if (police.getAttribute("animation-mixer").clip === randomidlespolice){
                    // Variable makes turning random
                    randomidlespolice = idlespolice[Math.floor(Math.random() * idlespolice.length)];

                    police.removeAttribute("animation-mixer");
                    police.setAttribute("animation-mixer", {clip: randomidlespolice, crossFadeDuration: ".3", loop:"repeat"});

                } 

                // check if idle, and should be idle longer
                if (clipId === 0 && counter < countertrigger) {
                    counter++;
                    return;
                }

                // check if this was the last animation
                if (clipId === (animations.length - 1)) {
                    // Reset helpers
                    clipId = 0;
                    counter = 1; // the animation will be played once within this callback
                    countertrigger = randomIntFromInterval(1,3);
                    speed+=0.2;
                } else {
                    clipId++;
                }



                if (police.getAttribute("animation-mixer").clip === randomturning && death === true){
                    // If kill case 2: If player never ducked while Police is looking. If so, shoot player. This works ONLY when turn animation has ended            
                        gameover();
                        audio3.volume = 0.6;
                        audio3.play();

                } else {
                    // play the next clip
                    police.setAttribute("animation-mixer", {clip: animations[clipId],  crossFadeDuration: ".2", timeScale: speed});
                }

            });
        
        }   
    }
});