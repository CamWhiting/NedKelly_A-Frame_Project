// Custom code I use for my project

// Component to Ned Kelly Logic
AFRAME.registerComponent('nedkelly-logic', {
    init: function () {

        // Defined items for easier referencing
        var el = this.el;
        var nedkelly = document.querySelector('#nedkelly')
        var scene = document.querySelector('a-scene')

        var death = true;

        var audio = new Audio('./audio/folksey-mixkit.mp3')
        audio.volume = 0.2;


        /////// NED KELLY LOGIC ///////

        // Air Vairables
        var air = document.querySelector('#air')
        var losingairInterval, gainingairInterval;


        // Determines the random idles for Ned Kelly
        var idles = ["idleLooking", "idleMoving", "idleStill"];
        var randomidles = "idleLooking";

        // Default animation for Ned Kelly
        nedkelly.setAttribute("animation-mixer", {clip: randomidles});

        // Checks if animation loop has ended for Ned Kelly
        nedkelly.addEventListener('animation-loop', function () {

            // If animation clip is one of the random idles in the array
            if(nedkelly.getAttribute = nedkelly.getAttribute("animation-mixer", {clip: randomidles})) {
                // Variable makes idles random
                var randomidles = idles[Math.floor(Math.random() * idles.length)];

                    // See what animation it is and reapply a random idle.
                    nedkelly.removeAttribute("animation-mixer");
                    nedkelly.setAttribute("animation-mixer", {clip: randomidles, crossFadeDuration: ".3", loop:"repeat"});
            }
        });

        // Drowning Mechanic
        function drowning() {
            if (air.value <= 0) {
                clearInterval(losingairInterval)
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

        // Code to crouch Ned Kelly

        function crouchingdown() {
            audio.play();
            audio.loop = true;
             nedkelly.setAttribute("animation-mixer", {clip: "crouchDown", crossFadeDuration: ".2", loop: "once", clampWhenFinished: "true",});
            clearInterval(gainingairInterval)
            losingairInterval = setInterval(drowning, 100)
            death = false;
        }

        // Code to surface Ned Kelly
        function crouchingup() {
            nedkelly.removeAttribute("animation-mixer");
            nedkelly.setAttribute("animation-mixer", {clip: "crouchDown", crossFadeDuration: ".2", clampWhenFinished: "false",
            timeScale: "-0.3"});
            clearInterval(losingairInterval)
            gainingairInterval = setInterval(gainingair, 200)
            death = true;

            // If kill case 1: If player goes up while Police is looking. If so, shoot player. This works in all instances UNLESS the player never ducked

            if (police.getAttribute("animation-mixer").clip === "idleAt"){
                 el.removeEventListener('pointerdown', crouchingdown);
                 el.removeEventListener('pointerup', crouchingup);
                 police.setAttribute("animation-mixer", {clip: "shootAt", crossFadeDuration: ".2", clampWhenFinished: "true", loop:"once"});
                 nedkelly.removeAttribute("animation-mixer");
                 nedkelly.setAttribute("animation-mixer", {clip: "dying", crossFadeDuration: ".2", loop:"once", clampWhenFinished: "true"});
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
                    console.log("you should be dead");
                // If kill case 2: If player never ducked while Police is looking. If so, shoot player. This works ONLY when turn animation has ended
           
                 
            
                    police.removeAttribute("animation-mixer");
                    police.setAttribute("animation-mixer", {clip: "shootAt", crossFadeDuration: ".2", clampWhenFinished: "true", loop:"once"});
                    el.removeEventListener('pointerdown', crouchingdown);
                    el.removeEventListener('pointerup', crouchingup);
                    nedkelly.removeAttribute("animation-mixer");
                    nedkelly.setAttribute("animation-mixer", {clip: "dying", crossFadeDuration: ".2", loop:"once", clampWhenFinished: "true"});
                    el.removeEventListener('animation-loop', policeloop);
             
                
             
            } else {
                // play the next clip
                police.setAttribute("animation-mixer", {clip: animations[clipId]});
            }

        });

        
    }
});
