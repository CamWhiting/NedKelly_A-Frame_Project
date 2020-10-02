// Custom code I use for my project



// Component to Ned Kelly Logic
AFRAME.registerComponent('nedkelly-logic', {
    init: function () {

        // Defined items for easier referencing
        var el = this.el;
        var nedkelly = document.querySelector('#nedkelly')
        var scene = document.querySelector('a-scene')
        var cam = document.querySelector('#cam')
        var score = document.querySelector("#score")
        var interval;

        var totalScore = 0;
        
        var death = true;

        var audio = new Audio('./audio/folksey-mixkit.mp3')
        var audio2 = new Audio('./audio/folksey-mixkit-underwater.mp3')
        audio.volume = 0.2;
        audio2.volume = 0;
        
        // The far more complicated version of parenting the camera to Ned Kelly's head. First calling the skinned mesh THEN the skeleton. This was hands down the hardest thing to implement. I not only needed to learn Javascript and Aframe but also the fundamentals of three.js.
        nedkelly.addEventListener('model-loaded', function(event){
            const model = event.detail.model;
            const skinnedMesh = model.getObjectByName('nedKelly001');
            skinnedMesh.skeleton.bones[2].add(cam.object3D);
        });
  
        // Method to stop multi-touch affecting up the breathing mechanic 
        var killmulti = 0;

        
        /////// HIGH SCORE ///////
        interval = setInterval(setTime, 1000);

        function setTime() {
            ++totalScore;
            score.innerHTML = pad(totalScore);
        }

        function pad(val) {
            var valString = val + "";
            return valString;

        }
        

        /////// NED KELLY LOGIC ///////

        // Air Vairables
        var air = document.querySelector('#air')
        var losingairInterval, gainingairInterval;

        // Default animation for Ned Kelly
        nedkelly.setAttribute("animation-mixer", {clip: "idleStill"});


        // Drowning Mechanic
        function drowning() {
            if (air.value <= 0) {
                audio.pause();
                clearInterval(losingairInterval);
                clearInterval(interval);
                nedkelly.setAttribute("animation-mixer", {clip: "dying", crossFadeDuration: ".2", loop:"once", clampWhenFinished: "true"});
                el.removeEventListener('pointerdown', crouchingdown);
                el.removeEventListener('pointerup', crouchingup);
            } else {
                air.value--;
            }
        }

        // Breathing Mechanic
        function gainingair() {
            if (air.value == 100) {
                clearInterval(gainingairInterval)
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
                clearInterval(gainingairInterval)
                losingairInterval = setInterval(drowning, 200)
                death = false;
                audio.play();
                audio2.play();
                audio.loop = true;
                audio2.loop = true;
//                setTimeout(function() {
                    audio.volume = 0;
                    audio2.volume = 0.2;
//                }, delay);
            }
            
          
        }

        // Code to surface Ned Kelly
        function crouchingup() {
            killmulti--;
            if (killmulti < 1) {
                audio.volume = 0.2;
                audio2.volume = 0;
                nedkelly.removeAttribute("animation-mixer");
                nedkelly.setAttribute("animation-mixer", {clip: "idleStill", crossFadeDuration: ".4", loop:"repeat", clampWhenFinished: "true"});
                clearInterval(losingairInterval)
                gainingairInterval = setInterval(gainingair, 400)
                death = true;
//                setTimeout(function() {
//                    if (audio.volume = 0) {
//                            audio.volume = 0.2;
//                            audio2.volume = 0;
//                    }}, delay);
            }
            
                            
            if (audio2.volume == 0.2 && killmulti == 0){
                    audio.volume = 0.2;
                    audio2.volume = 0;
            }


            // If kill case 1: If player goes up while Police is looking. If so, shoot player. This works in all instances UNLESS the player never ducked

            if (police.getAttribute("animation-mixer").clip === "idleAt"){
                 audio.pause();
                 audio2.pause();
                 el.removeEventListener('pointerdown', crouchingdown);
                 el.removeEventListener('pointerup', crouchingup);
                 police.setAttribute("animation-mixer", {clip: "shootAt", crossFadeDuration: ".2", clampWhenFinished: "true", loop:"once"});
                 nedkelly.removeAttribute("animation-mixer");
                 nedkelly.setAttribute("animation-mixer", {clip: "dying", crossFadeDuration: ".2", loop:"once", clampWhenFinished: "true"});
                 clearInterval(interval);
            }

        }

        // Crouch Controls
        el.addEventListener('pointerup', crouchingup);
        el.addEventListener('pointerdown', crouchingdown);


        /////// POLICEMAN LOGIC ///////

        var police = document.querySelector('#police')

        // Determines the random idles for Policeman
        var idlespolice = ["idleLooking", "idleMoving", "idle"];
        var randomidlespolice = "idle";
        var shoot = "shootAt"

        var randomturning = "turningLeft";
        var turning = ["turningLeft", "turningRight"]

        // Default animation for Policeman
        police.setAttribute("animation-mixer", {clip: randomidlespolice});

        // animation helpers - Simplifies the Policeman's turning logic
        var animations = [randomidlespolice, randomturning, "idleAt"]
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
            
                // Randomise Police turn for next time. CANNOT USE UNTIL FIX TURNING KILL LOGIC
                // randomturning = turning[Math.floor(Math.random() * turning.length)];

            if (police.getAttribute("animation-mixer").clip === randomidlespolice){
                // Variable makes turning random
                randomidlespolice = idlespolice[Math.floor(Math.random() * idlespolice.length)];

                police.removeAttribute("animation-mixer");
                police.setAttribute("animation-mixer", {clip: randomidlespolice, crossFadeDuration: ".3", loop:"repeat"});

            };

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
            } else {
                clipId++
            }
              
          
            
            if (police.getAttribute("animation-mixer").clip === randomturning && death === true){
                // If kill case 2: If player never ducked while Police is looking. If so, shoot player. This works ONLY when turn animation has ended            
                    audio.pause();
                    police.removeAttribute("animation-mixer");
                    police.setAttribute("animation-mixer", {clip: "shootAt", crossFadeDuration: ".2", clampWhenFinished: "true", loop:"once"});
                    el.removeEventListener('pointerdown', crouchingdown);
                    el.removeEventListener('pointerup', crouchingup);
                    nedkelly.removeAttribute("animation-mixer");
                    nedkelly.setAttribute("animation-mixer", {clip: "dying", crossFadeDuration: ".2", loop:"once", clampWhenFinished: "true"});
                    clearInterval(interval);
             
            } else {
                // play the next clip
                police.setAttribute("animation-mixer", {clip: animations[clipId],  crossFadeDuration: ".2"});
            }

        });

        
    }
});
