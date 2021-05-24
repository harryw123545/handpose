function calculate() {
    for (let i = 0; i < predictions.length; i += 1) {
        const prediction = predictions[i];
        for (let j = 0; j < prediction.landmarks.length; j += 1) {
            const keypoint = prediction.landmarks[j];
            
            //comment in to draw circles for each point in handpose array 
            //fill(0, 255, 0);
            //noStroke();
            //ellipse(keypoint[0], keypoint[1], 10, 10);

            
            //store point for base of hand in a variable
            base = prediction.landmarks[0];

            
            //create variables for the tips of each finger
            thumb = prediction.landmarks[4];
            index = prediction.landmarks[8];
            middle = prediction.landmarks[12];
            ring = prediction.landmarks[16];
            pinky = prediction.landmarks[20];

            
            //calculate distance from each fingertip to the base of the hand
            //map values between 0 and 1
            let thumbAverage = map(dist(base[0], base[1], thumb[0], thumb[1]), 20, 230, 0, 1, true);
            let indexAverage = map(dist(base[0], base[1], index[0], index[1]), 20, 300, 0, 1, true);
            let middleAverage = map(dist(base[0], base[1], middle[0], middle[1]), 20, 310, 0, 1, true);
            let ringAverage = map(dist(base[0], base[1], ring[0], ring[1]), 20, 300, 0, 1, true);
            let pinkyAverage = map(dist(base[0], base[1], pinky[0], pinky[1]), 20, 250, 0, 1, true);

            
            //smooth thumb data
            if (thumbDeque.length > AVERAGE_SAMPLES) {
                //remove first element - only if we have hit number of samples we want to measure  
                thumbDeque.shift();
            }
            
            //add latest measurement
            thumbDeque.push(thumbAverage);

            //calculate average using reduce (loops though values with an accumulator a, and current value c - we add c to the acumulator to get the total, then divide by the length
            thumbDist = thumbDeque.reduce((a,c) => a + c, 0) / thumbDeque.length;  

            
            //smooth index data
            if (indexDeque.length > AVERAGE_SAMPLES) {
                //remove first element - only if we have hit number of samples we want to measure  
                indexDeque.shift();
            }
            
            //add latest measurement
            indexDeque.push(indexAverage);

            //calculate average using reduce (loops though values with an accumulator a, and current value c - we add c to the acumulator to get the total, then divide by the length
            indexDist = indexDeque.reduce((a,c) => a + c, 0) / indexDeque.length; 

            
            //smooth middle data
            if (middleDeque.length > AVERAGE_SAMPLES) {
                //remove first element - only if we have hit number of samples we want to measure  
                middleDeque.shift();
            }
            
            //add latest measurement
            middleDeque.push(middleAverage);

            //calculate average using reduce (loops though values with an accumulator a, and current value c - we add c to the acumulator to get the total, then divide by the length
            middleDist = middleDeque.reduce((a,c) => a + c, 0) / middleDeque.length;

            
            //smooth ring data
            if (ringDeque.length > AVERAGE_SAMPLES) {
                //remove first element - only if we have hit number of samples we want to measure  
                ringDeque.shift();
            }
            
            //add latest measurement
            ringDeque.push(ringAverage);

            //calculate average using reduce (loops though values with an accumulator a, and current value c - we add c to the acumulator to get the total, then divide by the length
            ringDist = ringDeque.reduce((a,c) => a + c, 0) / ringDeque.length;

            
            //smooth pinky data
            if (pinkyDeque.length > AVERAGE_SAMPLES) {
                //remove first element - only if we have hit number of samples we want to measure  
                pinkyDeque.shift();
            }
            
            //add latest measurement
            pinkyDeque.push(pinkyAverage);

            //calculate average using reduce (loops though values with an accumulator a, and current value c - we add c to the acumulator to get the total, then divide by the length
            pinkyDist = pinkyDeque.reduce((a,c) => a + c, 0) / pinkyDeque.length;
            
            }
    }
}

function sound() {
    
    //create if statements for each distance measurement
    //if the distance for each finger is greater than 0.3, play corresponding sound files
    if (thumbDist > 0.3){
        eno[0].play();
        eno[0].loop();
        
        //apply distance measurement to volume
        eno[0].setVolume(thumbDist);
    } else{
        eno[0].stop();
    }

    
    if (indexDist > 0.3){
        eno[1].play();
        eno[1].loop();
        
        //apply distance measurement to volume
        eno[1].setVolume(indexDist);
    } else{
        eno[1].stop();
    }

    
    if (middleDist > 0.3){
        eno[2].play();
        eno[2].loop();
        
        //apply distance measurement to volume
        eno[2].setVolume(middleDist);
    } else{
        eno[2].stop();
    }

    
    if (ringDist > 0.3){
        eno[3].play();
        eno[3].loop();
        
        //apply distance measurement to volume
        eno[3].setVolume(ringDist);
    } else{
        eno[3].stop();
    }

    
    if (pinkyDist > 0.3){
        eno[4].play();
        eno[4].loop();
        
        //apply distance measurement to volume
        eno[4].setVolume(pinkyDist);
    } else{
        eno[4].stop();
    }
}