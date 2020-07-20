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
        
        var air = document.querySelector('#air').value;
        
        // Determines the random idles for Ned Kelly  
                var idles = ["idleLooking", "idleMoving", "idleStill"];
                var randomidles = "idleLooking";
        
        // Default animation for Ned Kelly        
            nedkelly.setAttribute("animation-mixer");
        
        // Checks if animation loop has ended
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
        
        
        
            
            function drowning(){
                if (air = 0){
                    nedkelly.setAttribute("animation-mixer", {clip: "dying", crossFadeDuration: ".2", loop:"once", clampWhenFinished: "true"});
                } 
                else {      
                    air--;
                    console.log(air);
                }
            }
        
        // Code to crouch Ned Kelly
        el.addEventListener('pointerdown', function() {
            audio.play();
            audio.loop = true;
             nedkelly.setAttribute("animation-mixer", {clip: "crouchDown", crossFadeDuration: ".2", loop: "once", clampWhenFinished: "true",});

            var losingair = setInterval(drowning, 250); 
            
            
            
            // A variable to determine if a death trigger will set
            var death = false;
        });
        
        
        // Code to surface Ned Kelly 
        el.addEventListener('pointerup', function() {
            nedkelly.removeAttribute("animation-mixer");
            nedkelly.setAttribute("animation-mixer", {clip: "crouchDown", crossFadeDuration: ".2", clampWhenFinished: "false",
            timeScale: "-0.3"}); 

            clearInterval(downing);
            
            setInterval(breathing, 200);
            function breathing() {
                if (air = 100) {
                    clearInterval(breathing);
                }
                else {
                    air++; 
                    console.log(air);
                }
            
            }
            
            
            
            var death = true;
        });   
        
        
        // If Ned Kelly is seen kill him. Kill him dead :P
        if($death = true){
            police.setAttribute("animation-mixer", {clip: "shoot", crossFadeDuration: ".2", clampWhenFinished: "true"}); 
//            nedkelly.removeEventListener("mousedown", myFunction);
//            nedkelly.removeEventListener("mouseup", myFunction);
            nedkelly.removeAttribute("animation-mixer");
            nedkelly.setAttribute("animation-mixer", {clip: "dying", crossFadeDuration: ".2", loop:"once", clampWhenFinished: "true"}); 
           };
        
    
    
        
        
    }
});
           


//                 console.log("done");



