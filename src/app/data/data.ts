export const textData = [
        {title:'What is the rate of star formation in a galaxy?' , 
          desc: `
          Represented as R* in the Drake Equation, 
          this value is an estimation of the number of 
          stars that form in the galaxy on a yearly basis. 
          In the original formula the estimate was aprroximately 
          1 star formed per year on average over the life of the 
          galaxy; even at the time this was considered to be a 
          conservative estimate.`},
        {title:'What is the percentage of planetary systems?' , 
          desc: `
          Represented as fₚ in the Drake Equation, 
          this value is an estimation of the average 
          pecentage of planets that form around stars. 
          In the original formula is between 20%-50%`},
        {title:'Average number of planets in a habitable zone?' , 
          desc: `
          Represented as nₑ in the Drake Equation, 
          this value is an estimation of the number 
          of planets that exist within the habitable 
          zone in a star system. In the original formula 
          the estimate was between 1-5.`},
        {title:'What are the chances of life forming?' , 
          desc: `
          Represented as fₗ in the Drake Equation, 
          this vaule is an estimation of the chances a 
          planet will eventually develop life, it was 
          orignally estimated to be 100%.`},
        {title:'What are the chances of evolution taking place?' , 
          desc: `
          Represented as fᵢ in the Drake Equation, 
          this value is an estimation of the possibility 
          that intelligent life will evolve on the planet. 
          This was also originally estimated to be 100%`},
        {title:'What are the change a civilization will develop radio communication?' , 
          desc: `
          Represented as f꜀ in the Drake Equation, 
          this value is an estimation of the chance 
          that this intelligent life will develop 
          deep detectable signs of life, such as radio 
          communication. The original estimation was 
          between 10%-20%`},
        {title:'What is the average lifespan of a civilization?' , 
          desc: `
          Represented as L in the Drake Equation, 
          this is value an estimation of the length 
          of time such a civilization would be 
          releasing detectable signals into space, 
          esentially determing how long they are 
          discoverable. The original estimation 
          was somehwere between 1,000-100,000,000 years`},
      ];
       
export const configData=[
        {min:0.1,max:3,step:0.1, label:"r*",default:0.5},
        {min:1,max:100,step:1, label:"fp"},
        {min:0.1,max:5,step:0.1, label:"ne"},
        {min:1,max:100,step:1, label:"fl"},
        {min:1,max:100,step:1, label:"fi"},
        {min:1,max:100,step:1, label:"fc"},
        {min:1,max:10000000000,step:10000, label:"L"}, //Use scaled values to reach max value
      ]

      export const formatData=[
        {isPercent:false},
        {isPercent:true},
        {isPercent:false},
        {isPercent:true},
        {isPercent:true},
        {isPercent:true},
        {isPercent:false},
      ]

