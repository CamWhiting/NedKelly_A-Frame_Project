// Custom code I use for my project

// Component to Ned Kelly Logic
AFRAME.registerComponent('nedkelly-logic', {
    init: function() {
        
        // Defined items for easier referencing
        var el = this.el;
        var nedkelly = document.querySelector('#nedkelly');
        var police = document.querySelector('#police');
        var scene = document.querySelector('a-scene');
        var audio = new Audio('./audio/folksey-mixkit.mp3');
        
        // Air Vairables
        var air = document.querySelector('#air');
        var losingairInterval, gainingairInterval;
        var death = true;
        
        // Determines the random idles for Ned Kelly  
                var idles = ["idleLooking", "idleMoving", "idleStill"];
                var randomidles = "idleLooking";
        
        // Default animation for Ned Kelly        
            nedkelly.setAttribute("animation-mixer");
            police.setAttribute("animation-mixer", {clip:"idleMoving"});
           

        // Checks if animation loop has ended for Ned Kelly
            nedkelly.addEventListener('animation-loop', function () {                
                
                // If animation clip is one of the random idles in the array
                if(nedkelly.getAttribute = nedkelly.getAttribute("animation-mixer", {clip: randomidles})) {
                    
                    // Variable makes idles random
                    var randomidles = idles[Math.floor(Math.random() * idles.length)];
                   
                    // See what animation it is and reapply a random idle.
                    nedkelly.removeAttribute("animation-mixer");
                    nedkelly.setAttribute("animation-mixer", {clip: randomidles, crossFadeDuration: ".3", loop:"repeat"});
                };  
            });

        // Drowning Mechanic    
        function drowning() {
            if (air.value <= 0) {
                console.log("You have drowned");
                clearInterval(losingairInterval);
                nedkelly.setAttribute("animation-mixer", {clip: "dying", crossFadeDuration: ".2", loop:"once", clampWhenFinished: "true"}); 
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
        
        // Code to crouch Ned Kelly
        el.addEventListener('pointerdown', function() {
            audio.play();
            audio.loop = true;
             nedkelly.setAttribute("animation-mixer", {clip: "crouchDown", crossFadeDuration: ".2", loop: "once", clampWhenFinished: "true",});
            clearInterval(gainingairInterval);
            losingairInterval = setInterval(drowning, 100);
            var death = false;
        });
        
        
        // Code to surface Ned Kelly 
        el.addEventListener('pointerup', function() {
            nedkelly.removeAttribute("animation-mixer");
            nedkelly.setAttribute("animation-mixer", {clip: "crouchDown", crossFadeDuration: ".2", clampWhenFinished: "false",
            timeScale: "-0.3"});
            clearInterval(losingairInterval);
            gainingairInterval = setInterval(gainingair, 200);
        });   
        
         console.log(police.getAttribute("animation-mixer"));
        
     

        if (police.getAttribute("animation-mixer").clip === "lookAt"){
            console.log("U R DEAD");
            
              
         console.log(police.getAttribute("animation-mixer"));
            
            police.setAttribute("animation-mixer", {clip: "shootAt", crossFadeDuration: ".2", clampWhenFinished: "true", loop:"once"}); 
            // nedkelly.removeEventListener("mousedown", myFunction);
            // nedkelly.removeEventListener("mouseup", myFunction);
            nedkelly.removeAttribute("animation-mixer");
            nedkelly.setAttribute("animation-mixer", {clip: "dying", crossFadeDuration: ".2", loop:"once", clampWhenFinished: "true"}); 
           };  
    }
});




