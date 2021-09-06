import dotenv from "dotenv";
import { join } from "path";
import { createPostComments } from "@utils/generateImage";

dotenv.config();

const videoComments = {
  title: "Americans do you want universal healthcare? Why/why not?",
  comments: [
    {
      text: "My daughter had a fever abroad in france. We debated frantically if we should take her to the doctor because we didn't know how our insurance would cover it. We thought the worst and that it was covid. The doctor did a full exam for 30€. We were expecting a huge bill after. Nothing ever came. Yeah, the healthcare system in the USA is utter corporatized filth. Burn it to the ground.",
      subComment: [
        {
          text: "That's just horrible. I was once changing jobs and my kids insurance is through me. As it happened due to some clerical issue my insurance was not sorted out and my kid fell and had symptoms of the brain concussion.",
          subComment: [
            {
              text: "The fact that this is controversial or debatable makes me sad to be honest...",
              subComment: [],
            },
          ],
        },
        {
          text: "Americans - you're already paying for healthcare.",
          subComment: [],
        },
      ],
    },
    {
      text: "I got stabbed 10 times standing up for a woman. I was charged over 10000 for the ambulance ride, surgery, and additional medical. It was worth every penny. But I was left in debt before my adult life started.",
      subComment: [],
    },
    {
      text: "Death or Debt ultimatums are very real here. Ive personally been involved in a few for myself or others. In the US its not uncommon for ppl to suffer potentially life threatening injuries (like my mom got drunk and full blown tripped face first into a stone hearth and had massive bruising on her face) and decide they dont want to risk the bill. Theyd rather risk death then have suffer even the possibility that the trip wasnt worth it. My disease causes some pretty extreme heart and motor problems. I have severe dysautonomia and my vitals can get extremely unstable. Also have something called paroxysmal nonkinesigenic dyskinesia. Thats basically a descriptive diagnosis for episodes of uncontrollable violent flailing that can last hours. I have my own ecg machine. Not even joking. Thats so that if i have an episode i can take my own ecg and decide whether to go to the ER. Bought a freaking textbook so i could interpret the damn thing. Had an episode where my heart rate was up to 170 beats a minute. I had severe ST depressions, chest pain, dizziness and my oxygen was tanking and i waited a couple hours to see if it would go away. Thankfully it did. The nearest hospital was over an hour away. Ppl SHOULD feel comfortable seeking health care when symptoms are that bad. The one time i did call an ambulance i had been flailing on the bathroom floor for 5 solid hours after a heart and digestive episode triggered a motor episode. I had ripped off all my clothes cuz i cant control my temperature when that happens so i cycle between really hot and really cold. I lost control of my bowels and defecated on myself and had already collected 60 or so bruises from slamming against the walls and toilet. They got me out somehow, i blew outa both ends in the ambulance. Nearly throttled the emt because the only thing i can control is my hands so i grip stuff. They needed me to loosen my grip on the rail to get an IV and my hand snapped right into their scrubs and i locked up again. Exploded the IV in my arm. Requested restraints for myself then broke them all. They wheeled me into the ER naked and covered in puke and crap and it took them another 5 hours of giving me IV ativan, anti nausea and pain meds to get it to stop enough to get a CT to make sure i hadnt ruptured my bowels. Thats how bad it had to be to make me choose the ambulance. My story isnt even that unique. The ambulance ride alone was 15k. I didnt even bother opening the hospital bill. I cant pay that off. Even a healthy person capable of working couldnt. Its gunna sit there in collections forever.",
      subComment: [],
    },
  ],
};

createPostComments(videoComments.comments[0]);
