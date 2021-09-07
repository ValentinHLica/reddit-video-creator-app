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
          text: "That's just horrible. I was once changing jobs and my kids insurance is through me. As it happened due to some clerical issue my insurance was not sorted out and my kid fell and had symptoms of the brain concussion. Where at? I was puking all day saturday..I couldn't keep down even water and thought my skin looked a strange color so I thought I should go to the doctor..Was extremely weak too. Some anti-vomit/nausea medicine and an IV and I felt better in a few hours. I kinda wonder if I actually should have gone or if I should have toughened it out for 24 hours and hoped to get better.. I have no one to take care of me while I'm sick and I was worried of becoming 'too sick' too.. -edit.. I live in socal seems to be going around the US?..Weird thing is that I hardly go out and get in contact with people. Like I can pinpoint exactly where I got it from and when.. Which was when I went out for some fast food on friday night..It was my favorite place so maybe one of the employees got sick a few days earlier and didn't wash enough? or a customer got sick and their sick germs were all over the place.. I do know the norovirus is extremely contagious.. Was also wondering if I should call them and tell them I got the stomach flu from their place or not..",
          subComment: [
            {
              text: "The fact that this is controversial or debatable makes me sad to be honest It is a mix. Day to day you can realistically only spen 5-10 out of pocket that even a minimum wage worker can deal with. But pro rate in the monthly costs, and it gets crazy. In my area a 1 bedroom in a bad area is still 1200 per month, or about $40 a day. Transit for most people will be at least $5- and that is cost of mass transit to and from work; more if you drive (car, insurance, upkeep, gas). Not having a car is not always an option. On 40 hours at $10 an hour, you are bringin in about 1200 a month. You lose some of that to taxes, but lets be nice and say you get it all. You already cannot afford a studio apartment- so you need a roommate. So you have to hopefully find someone sane- but that is not a given. So basically, on your own, on a full time minimum wage job, you basically are eating garbage to just not be hungry. living with 2-3 roommates with the same problems you have, and will have no ability to save enough to ever make a difference. $500 is huge savings over a whole year for you- and that is not life changing at all.",
              subComment: [],
            },
          ],
        },
        {
          text: "It would be better if they had to live with their lowest salaried employee for a month or two, imo. In their house, dinner with the family, travel to and from work together, same lunch, kids with homework, the works. Building that relation would imo do much more for this problem than just 'experiencing below your normal standard of living before returning to it'.. You're more likely to feel empathy for a family you know, and much less likely to forget them. Anything else would just be another show about wealthy people having a fun adventure to talk about at cocktail parties",
          subComment: [],
        },
      ],
    },
    {
      text: "It would be incredibly self-serving and boring. They would never truly experience what it is like to be in the precarious position of a minimum wage employee living hand-to-mouth and the 'novelty' is just salt in the wound. It would be more interesting to see the reverse.",
      subComment: [],
    },
  ],
};

createPostComments(videoComments.comments[0]);
