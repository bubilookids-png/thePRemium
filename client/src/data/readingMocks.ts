export type QuestionType = 'true_false_not_given' | 'fill_in_the_blanks' | 'multiple_choice' | 'matching_headings' | 'matching_features';

export interface Question {
  id: string;
  type: QuestionType;
  instructions: string;
  text?: string;
  options?: string[]; // for multiple choice or matching
  answer: string;
  number: number;
}

export interface Passage {
  id: string;
  title: string;
  text: string;
  questions: Question[];
}

export interface ReadingMock {
  id: string;
  title: string;
  passages: Passage[];
}

export const readingMocks: ReadingMock[] = [
  {
    id: "mock-1",
    title: "IELTS Academic Reading Practice Test 1",
    passages: [
      {
        id: "p1",
        title: "Sleep Study on Modern-Day Hunter-Gatherers Dispels Popular Notions",
        text: `A
The sleep troubles common in modern life have long been blamed on our industrial society, from the city lights, long work hours and commutes, to caffeine and the Internet. Sleep researchers often look back on a time when humans were able to get more rest by sleeping and waking to the rhythms of the sun. It turns out that this may not be quite right. In fact, our ancestors may not have been getting the recommended eight hours of sleep, either.
B
In a recent study, researchers traveled all over the world to examine sleep in some of the world’s last remaining hunter-gatherer societies – the Hadza of Tanzania, the San of Namibia, and the Tsimane of Bolivia. Cut off from media, electricity and other distractions, these pre-industrial societies are thought to sleep the way humans did more than 10,000 years ago. Traveling to where they lived, often in humid, remote locations, researchers used medical devices to record the sleeping habits of 94 of these tribespeople and ended up collecting data representing 1,165 days.
C
They found very similar sleep patterns despite their geographic isolation. On average, all three groups sleep a little less than 6.5 hours a night, do not take naps, and don’t go to sleep when it gets dark. Like many of us, the Hadza, San, and Tsimane spend more time in bed – from 6.9 to 8.5 hours – than they do actually sleeping. This adds up to a sleep efficiency that is very similar to today’s industrial populations.
D
According to Jerome Siegel, director of the University of California’s Center for Sleep Research, evidence suggests sleep habits may not be environmental or cultural, but central to the physical makeup of humans. These findings question the millions of dollars that have been spent on research that tries to explain why some sleepers get only about six hours of sleep a night. Also, such findings question whether lack of sleep is a cause of obesity, mood disorders, and other physical and mental illnesses which have become so common in recent decades. Scientists have documented that people’s energy often falls in the mid-afternoon. Some have suggested that it’s because we' ve managed to suppress a natural desire for a nap.
E
However, the new study provides evidence that this is unlikely, and that napping was actually rare in hunter-gatherer societies. The researchers estimated that naps may have occurred on up to 7 percent of winter days and 22 percent of summer days. They noted that their devices were only good at detecting longer naps, so it is possible that some of the study subjects took naps that were short, perhaps 15 minutes or less.
F
Another fascinating finding from the study had to do with the circadian rhythms, our daily activity cycles related to sunlight. Instead of going to sleep right at dusk, tribespeople were staying awake an average of between 2.5 and 4.4 hours after sunset. All three tribes had fires going, but the light itself was much lower than you might get from a light bulb. They did, however, have a tendency to wake up anywhere between an hour before and an hour after sunrise.
G
Siegel and his co-authors investigated this further by looking into the significance of temperature. They found that it also played a big role, though it was somewhat less important than light in influencing sleep patterns. They wrote that “sleep in both the winter and summer usually occurred during the period of cooling and that waking times usually occurred near the height of the daily warming trend.”
H
The tribespeople that were studied are different from people living in modern conditions in a number of respects. Importantly, almost none of them were troubled by sleeplessness. In interviews with the researchers conducted through interpreters, only 1.5 to 2.5 percent of the study subjects said they had severe difficulties sleeping more than once a year. This figure is far lower than the 10 to 30 percent recorded in many industrialized countries today. Siegel suggested that “mimicking aspects of the natural environment” may therefore help treat some sleep disorders.
I
The tribespeople are also much healthier. Not a single one is overweight, indicating their overall higher levels of physical fitness. They also tended to have healthier hearts. Thus comes a critical question. If we can’t blame our health problems on our lack of sleep, could it be that the reason we feel so unrested is because of poor health?`,
        questions: [
          {
            id: "q1",
            number: 1,
            type: "true_false_not_given",
            instructions: "Do the following statements agree with the information given in Reading Passage 1? Choose TRUE, FALSE or NOT GIVEN.",
            text: "Scientists studied hunter-gatherer societies because their sleep patterns are assumed to be similar to those of humans more than 10,000 years ago.",
            options: ["TRUE", "FALSE", "NOT GIVEN"],
            answer: "TRUE"
          },
          {
            id: "q2",
            number: 2,
            type: "true_false_not_given",
            instructions: "Do the following statements agree with the information given in Reading Passage 1? Choose TRUE, FALSE or NOT GIVEN.",
            text: "The medical devices used in the research were specially designed for humid conditions.",
            options: ["TRUE", "FALSE", "NOT GIVEN"],
            answer: "NOT GIVEN"
          },
          {
            id: "q3",
            number: 3,
            type: "true_false_not_given",
            instructions: "Do the following statements agree with the information given in Reading Passage 1? Choose TRUE, FALSE or NOT GIVEN.",
            text: "Researchers found that tribespeople stayed longer in bed than inhabitants of industrialised regions.",
            options: ["TRUE", "FALSE", "NOT GIVEN"],
            answer: "FALSE"
          },
          {
            id: "q4",
            number: 4,
            type: "true_false_not_given",
            instructions: "Do the following statements agree with the information given in Reading Passage 1? Choose TRUE, FALSE or NOT GIVEN.",
            text: "Jerome Siegel believes that environment and culture have little effect on sleep patterns.",
            options: ["TRUE", "FALSE", "NOT GIVEN"],
            answer: "TRUE"
          },
          {
            id: "q5",
            number: 5,
            type: "fill_in_the_blanks",
            instructions: "Complete the notes below. Choose ONE WORD ONLY from the passage for each answer.\n\nNew Evidence on Sleep Patterns\nNew ideas about napping\nscientists have recorded an afternoon drop in [5]",
            answer: "energy" // from text: "people’s energy often falls in the mid-afternoon"
          },
          {
            id: "q6",
            number: 6,
            type: "fill_in_the_blanks",
            instructions: "studies of hunter-gatherer societies show that napping was rare and occurred more often during the [6]",
            answer: "summer" // from text: "7 percent of winter days and 22 percent of summer days"
          },
          {
            id: "q7",
            number: 7,
            type: "fill_in_the_blanks",
            instructions: "the devices may not have detected [7] naps",
            answer: "short"
          },
          {
            id: "q8",
            number: 8,
            type: "fill_in_the_blanks",
            instructions: "Daily activity cycles\nthe tribespeople went to sleep several hours after sunset with [8] there was little light",
            answer: "fires"
          },
          {
            id: "q9",
            number: 9,
            type: "fill_in_the_blanks",
            instructions: "tribes people usually woke up around [9]",
            answer: "sunrise"
          },
          {
            id: "q10",
            number: 10,
            type: "fill_in_the_blanks",
            instructions: "scientists found that [10] had almost as much influence on sleep patterns as light",
            answer: "temperature"
          },
          {
            id: "q11",
            number: 11,
            type: "fill_in_the_blanks",
            instructions: "Differences between tribespeople and people in industrialised regions\n[11] is something that very few of the tribespeople suffered from",
            answer: "sleeplessness"
          },
          {
            id: "q12",
            number: 12,
            type: "fill_in_the_blanks",
            instructions: "the environment of tribespeople may have been more suitable for sleep\ntribespeople had better fitness than industrialised populations and were not [12]",
            answer: "overweight"
          },
          {
            id: "q13",
            number: 13,
            type: "fill_in_the_blanks",
            instructions: "tribespeople also had stronger [13]",
            answer: "hearts"
          }
        ]
      },
      {
        id: "p2",
        title: "Bristlecone Pines",
        text: `A
On the dry, windswept mountain tops of the Great Basin in the western United States, at altitudes of over 3,000 m, grow the bristlecone pines (Pinus longaeva, Pinus aristata). The bristlecone has adjusted to places on earth that no other tree wants to inhabit, and in these harsh environments has flourished. Bristlecones don’t grow very tall, 18.3 m at the most, but usually much less, while the girth of the largest one has been measured at 11.2 m. What makes bristlecone pines truly remarkable is their longevity: their average age is over 1,000 years, with the oldest specimen - an individual known as Methuselah - dated at 4,723 years. This makes it not only the world’s oldest living tree; it is also the earth’s oldest living inhabitant. The extreme age of bristlecone pines was not known about until the 1950s, and was only discovered then thanks to the efforts of Edmund Schulman. In 1932, Schulman had begun his career in dendrochronology as an assistant to A. E. Douglass of the Laboratory of Tree-ring Research at the University of Arizona.
B
Douglass had noted that the wide rings of certain species of trees were produced during wet years and, inversely, narrow rings during dry seasons. The more a tree’s rate of growth has been affected by such environmental factors, the more variation in ring-to-ring growth will be present. This variation is referred to as sensitivity and the lack of ring variability is called complacency. Patterns of ring variability are important for establishing chronologies, which allow precise dating of climatic conditions in the past. Samples taken from trees of unknown age can be studied for matches with samples from trees of a known age with known sequences of growth. Using this process, when the rings match or are found to have overlapping patterns, the chronology can be extended further back in time.
C
In his search for older trees that would provide more extensive chronologies, Schulman learned that certain species of trees in the upper-forest zones, growing under stressful conditions, showed sensitive records of drought in their growth-ring sequences. The short, distorted, and dwarfed trees of the upper tree lines were now his focus. During 1954 and 1955, an extensive survey of bristlecone stands from California to Colorado was carried out by Schulman and his assistant assistant, C. W. Ferguson. They found the oldest trees at elevations of 3,048 to 3,354 m, often in seemingly impossible locations, on dolomite soils where no other plant life could survive. These trees showed large areas of deadwood and thin strips of living bark. The trees growing in the most extreme conditions, with scant soil and moisture, seemed to be the oldest. This prompted Schulman to write: ‘The capacity of these trees to live so fantastically long may, when we come to understand it fully, perhaps serve as a guidepost on the road to the understanding of longevity in general.’
D
So what factors do account for the longevity of bristlecone pines? Spring comes to the bristlecone pines in early May with the melting of snow and rising temperatures. In this subalpine zone there are only three warm summer months, often only six weeks, to produce growth and reserves for overwintering. All of this must be accomplished on a mere 25.4 cm of rainfall. To live so long under such conditions, the bristlecone has established several strategies. Firstly, bristlecone needles can live twenty to thirty years; thus, adding new foliage to that already on the tree takes little energy. The long-lived needles provide a stable photosynthetic capacity to sustain the tree over years of severe stress. Another strategy for surviving is the gradual dieback of living bark when the tree is damaged because of fire, lightning, drought, or storms. This reduction of tissue that the crown of the tree has to supply with nutrients balances the effect of any damage sustained. The surviving parts remain quite healthy. As an example, Pine Alpha, at over 4,000 years old, is over a metre in diameter, yet has only a 25 cm strip of living bark to support it. Finally, invasions from bacteria, fungi, or insects that prey upon most plants are unknown to the bristlecones due to their highly resinous wood.
E
Environmental factors also play their part. The dry air common in the subalpine region helps preserve the trees from rotting. The oldest bristlecones live in the most exposed sites, with considerable space between each tree. The longevity of the bristlecone needles and the inability of other plants to grow in the dolomite soil preferred by the bristlecones make for little leaf litter. This distance in between, combined with the lack of ground cover, ensures that if a tree sustains a lightning strike and catches fire, the fire does not spread to surrounding trees. Thus, the bristlecone pines have survived for unknown centuries. The current threat is from all the people who come to visit them. As a result, Methuselah, the oldest tree, is not marked or identified with a plaque due to the threat of vandalism. The recording of past events provided by these trees, along with their great beauty, is too valuable for us to lose.`,
        questions: [
          {
            id: "q14",
            number: 14,
            type: "matching_headings", // using matching_headings for finding section A-E
            instructions: "Which section contains the following information? Write the correct letter, A–E.",
            text: "an explanation of differences in ring patterns",
            options: ["A", "B", "C", "D", "E"],
            answer: "B"
          },
          {
            id: "q15",
            number: 15,
            type: "matching_headings",
            instructions: "Which section contains the following information? Write the correct letter, A–E.",
            text: "mention of a human danger to bristlecone pines",
            options: ["A", "B", "C", "D", "E"],
            answer: "E"
          },
          {
            id: "q16",
            number: 16,
            type: "matching_headings",
            instructions: "Which section contains the following information? Write the correct letter, A–E.",
            text: "an account of research conducted on bristlecone pines",
            options: ["A", "B", "C", "D", "E"],
            answer: "C"
          },
          {
            id: "q17",
            number: 17,
            type: "matching_headings",
            instructions: "Which section contains the following information? Write the correct letter, A–E.",
            text: "an advantage of the bristlecone pines’ habitat",
            options: ["A", "B", "C", "D", "E"],
            answer: "E"
          },
          {
            id: "q18",
            number: 18,
            type: "multiple_choice",
            instructions: "Choose the correct letter, A, B, C or D.",
            text: "According to the writer, the most interesting fact about bristlecone pines is their",
            options: ["A habitat.", "B height.", "C width.", "D age."],
            answer: "D"
          },
          {
            id: "q19",
            number: 19,
            type: "multiple_choice",
            instructions: "Choose the correct letter, A, B, C or D.",
            text: "A pattern of narrow rings is caused by",
            options: ["A alternating rainy and dry seasons.", "B a lack of rain.", "C restricted growth in some trees.", "D high altitude."],
            answer: "B"
          },
          {
            id: "q20",
            number: 20,
            type: "multiple_choice",
            instructions: "Choose the correct letter, A, B, C or D.",
            text: "Schulman chose to study trees growing at high levels because they were",
            options: ["A shorter than similar trees.", "B growing in unusual shapes.", "C much older than other trees.", "D the only surviving plants."],
            answer: "C" // Text: "In his search for older trees... certain species of trees in the upper-forest zones... showed sensitive records..."
          },
          {
            id: "q21",
            number: 21,
            type: "fill_in_the_blanks",
            instructions: "Complete the notes below. Choose NO MORE THAN TWO WORDS from the passage for each answer.\nFactors in the survival of bristlecone pines\na. features of bristlecone pines\nmaking new needles requires [21]",
            answer: "little energy" // Text: "adding new foliage... takes little energy"
          },
          {
            id: "q22",
            number: 22,
            type: "fill_in_the_blanks",
            instructions: "trees damaged by weather or fire can exist with only small areas of [22]",
            answer: "living bark" // Text: "gradual dieback of living bark... 25 cm strip of living bark"
          },
          {
            id: "q23",
            number: 23,
            type: "fill_in_the_blanks",
            instructions: "bristlecone wood is very [23]",
            answer: "resinous" // Text: "due to their highly resinous wood."
          },
          {
            id: "q24",
            number: 24,
            type: "fill_in_the_blanks",
            instructions: "b. features of the environment\ntrees don’t decay because of the [24]",
            answer: "dry air" // Text: "dry air common in the subalpine region helps preserve the trees from rotting."
          },
          {
            id: "q25",
            number: 25,
            type: "fill_in_the_blanks",
            instructions: "fires don’t spread easily because of the [25] between trees and absence of [26]",
            answer: "distance" // "distance in between" or "considerable space"
          },
          {
            id: "q26",
            number: 26,
            type: "fill_in_the_blanks",
            instructions: "and absence of [26]",
            answer: "ground cover" // "combined with the lack of ground cover"
          }
        ]
      },
      {
        id: "p3",
        title: "Loss of Rare Languages",
        text: `“Obviously we must do some serious rethinking of our priorities, lest linguistics go down in history as the only science that presided obviously over the disappearance of 90 percent of the very field to which it is dedicated.” — Michael Krauss, The World’s languages in Crisis
A
Ten years ago, Michael Krauss sent a shudder through the discipline of linguistics with his prediction that half the 6,000 or so languages spoken in the world would cease to be uttered within a century. Unless scientists and community leaders directed a worldwide effort to Stabilize the decline of local languages, he warned, nine tenths of the linguistic diversity of humankind would probably be doomed to extinction. Krauss’s prediction was little more than an educated guess, but other respected linguists had been clanging out similar alarms. Keneth L. Hale of the Massachusetts Institute of Technology noted in the same journal issue that eight languages on which he had done fieldwork had since passed into extinction. A 1990 survey in Australia found that 70 of the 90 surviving Aboriginal languages were no longer used regularly by all age groups. The same was true for all but 20 of the 175 Native American languages spoken or remembered in the US, Krauss told a congressional panel in 1992.
B
Many experts in the field mourn the loss of rare languages, for several reasons. To start, there is scientific self-interest; some of the most basic questions in linguistics have to do with the limits of human speech, which are far from fully explored. Many researchers would like to know which structural elements of grammar and vocabulary—If any—are truly universal and probably therefore hardwired into the human brain. Other scientists try to reconstruct ancient migration patterns by comparing borrowed words that appear in otherwise unrelated languages, in each of these cases, the wider the portfolio of languages you study, the more likely you are to get the right answers.
C
Despite the near constant buzz in linguistics about endangered languages over the past 10 years, the field has accomplished depressingly little. "You would think that there would be some organized response to this dire situation 'some attempt to determine which language can be saved and which should be documented before they disappear, says Sarah G Thomason, a linguist at the University of Michigan at Ann Arbor. But there isn’t any such effort organized in the profession. It is only recently that it has become fashionable enough to work on endangered languages." Six years ago, recalls Douglas H. Whalen of Yale University, when I asked linguists who was raising money to deal with these problems, i mostly got blank stares." So, Whalen and a few other linguists founded the Endangered Languages Fund. In the five years to 2001 they were able to collect only $80,000 for research grants. A similar foundation in England, directed by Nicholas Ostler, has raised just $8,000 since 1995.
D
But there are encouraging signs that the field has turned a corner. The Volkswagen Foundation, a German charity, just issued its second round of grants totaling more than 52 million. It has created a multimedia archive at the Max Planck Institute for Psycholinguistics in the Netherlands that can house recordings, grammars, dictionaries and other data on endangered languages. To fill the archive, the foundation has dispatched field linguists to document Aweti (100 or so speakers in Brazil), Ega (about 300 speakers in Ivory Coast). Waima’a (a few hundred speakers in East Timor), and a dozen or so other languages unlikely to survive the century. The Ford Foundation has also edged into the arena. Its contributions helped to reinvigorate a master-apprentice program created in 1992 by Leanne Hinton of Berkeley and Native Americans worried about the Imminent demise of about 50 indigenous languages in California. Fluent speakers receive $3,000 to teach a younger relative (who is also paid) their native tongue through 360 hours of shared activities, spread over six months. So far about 5 teams have completed the program, Hinton says, transmitting at least some knowledge of 25 languages. “It’s too early to call this language revitalization,” Hinton admits. “In California the death rate of elderly speakers will always be greater than the recruitment rate of young speakers. But at least we prolong the survival of the language.” That will give linguists more time to record these tongues before they vanish.
E
But the master-apprentice approach hasn’t caught on outside the U.S., and Hinton’s effort is a drop in the sea. At least 440 languages have been reduced to a mere handful of elders, according to the Ethnologue, a catalogue of languages produced by the Dallas-based group 511 International that comes closest to global coverage. For the vast majority of these languages, there Is little or no record of their grammar, vocabulary, pronunciation or use in daily life. Even if a language has been fully documented, all that remains once it vanishes from active use is a fossil skeleton, a scattering of features that the scientist was lucky and astute enough to capture. linguists may be able to sketch an outline of the forgotten language and fig its place on the evolutionary tree, but little more. “How did people start conversations and talk to babies? How did husbands and wives converse?” Hinton asks. “Those are the first things you want to learn when you want to revitalize the language.”
F
But there Is as yet no discipline of “conservation linguistics,” as there is for biology. Almost every strategy tried so far has succeeded in some places but failed in others, and there seems to be no way to predict with certainty what will work where. Twenty years ago in New Zealand, Maori speakers set up “language nests,” in which preschoolers were immersed in the native language. Additional Maori-only classes were added as the children progressed through elementary and secondary school. A similar approach was tried in Hawaii, with some success—the number of native speakers has stabilized at 1,000 or so, reports Joseph E. Grimes of SIL International, who Is working on Oahu. Students can now get instruction in Hawaiian all the way through university.
G
One factor that always seems to occur in the demise of a language is that the speakers begin to have collective doubts about the usefulness of language loyalty. Once they start regarding their own language as inferior to the majority language, people stop using it for all situations. Kids pick up on the attitude and prefer the dominant language. In many cases, people don’t notice until they suddenly realize that their kids never speak the language, even at home. This is how Cornish, and some dialects of Scottish Gaelic is still only rarely used for daily home life in Ireland, 80 years after the republic was founded with Irish as its first official language.
H
Linguists agree that ultimately, the answer to the problem of language extinction is multilingualism. Even uneducated people can learn several languages, as long as they start as children. Indeed, most people in the world speak more than one tongue, and in places such as Cameroon (279 languages), Papua New Guinea (823) and India (387) it is common to speak three or four distinct languages and a dialect or two as well. Most Americans and Canadians, to the west of Quebec, have a gut reaction that anyone speaking another language in front of them is committing an immoral act. You get the same reaction in Australia and Russia. It is no coincidence that these are the areas where languages are disappearing the fastest. The first step in saving dying languages is to persuade the world’s majorities to allow the minorities among them to speak with their own voices.`,
        questions: [
          {
            id: "q27",
            number: 27,
            type: "matching_headings",
            instructions: "Choose the correct heading for each paragraph from the list of headings below. Write the correct number, i–xi.",
            text: "Paragraph A",
            options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi"],
            answer: "v"
          },
          {
            id: "q28",
            number: 28,
            type: "matching_headings",
            instructions: "Choose the correct heading for each paragraph from the list of headings below. Write the correct number, i–xi.",
            text: "Paragraph B",
            options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi"],
            answer: "x" // Value of minority languages to linguists
          },
          {
            id: "q29",
            number: 29,
            type: "matching_headings",
            instructions: "Choose the correct heading for each paragraph from the list of headings below. Write the correct number, i–xi.",
            text: "Paragraph D",
            options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi"],
            answer: "iii" // Positive gains in protection efforts
          },
          {
            id: "q30",
            number: 30,
            type: "matching_headings",
            instructions: "Choose the correct heading for each paragraph from the list of headings below. Write the correct number, i–xi.",
            text: "Paragraph E",
            options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi"],
            answer: "i" // Inadequate data
          },
          {
            id: "q31",
            number: 31,
            type: "matching_headings",
            instructions: "Choose the correct heading for each paragraph from the list of headings below. Write the correct number, i–xi.",
            text: "Paragraph F",
            options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi"],
            answer: "vii" // Uncertainty about the success of native language programs
          },
          {
            id: "q32",
            number: 32,
            type: "matching_headings",
            instructions: "Choose the correct heading for each paragraph from the list of headings below. Write the correct number, i–xi.",
            text: "Paragraph G",
            options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi"],
            answer: "viii" // Lack in confidence in young speakers as a negative factor (and usefulness)
          },
          {
            id: "q33",
            number: 33,
            type: "matching_headings",
            instructions: "Choose the correct heading for each paragraph from the list of headings below. Write the correct number, i–xi.",
            text: "Paragraph H",
            options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi"],
            answer: "ii" // Consensus on an Initial recommendation for saving dying out languages (multilingualism)
          },
          {
            id: "q34",
            number: 34,
            type: "matching_features",
            instructions: "Match each statement with the correct person, A–F.",
            text: "Reported about the success of a language conservation practice In Hawaii",
            options: ["A Nicholas Ostler", "B Michael Krauss", "C Joseph E. Grimes", "D Sarah G. Thomason", "E Keneth L. Hale", "F Douglas H. Whalen"],
            answer: "C"
          },
          {
            id: "q35",
            number: 35,
            type: "matching_features",
            instructions: "Match each statement with the correct person, A–F.",
            text: "Predicted that many languages would disappear soon",
            options: ["A Nicholas Ostler", "B Michael Krauss", "C Joseph E. Grimes", "D Sarah G. Thomason", "E Keneth L. Hale", "F Douglas H. Whalen"],
            answer: "B"
          },
          {
            id: "q36",
            number: 36,
            type: "matching_features",
            instructions: "Match each statement with the correct person, A–F.",
            text: "Experienced loss of languages he had worked on personally",
            options: ["A Nicholas Ostler", "B Michael Krauss", "C Joseph E. Grimes", "D Sarah G. Thomason", "E Keneth L. Hale", "F Douglas H. Whalen"],
            answer: "E"
          },
          {
            id: "q37",
            number: 37,
            type: "matching_features",
            instructions: "Match each statement with the correct person, A–F.",
            text: "Raised language funds In England",
            options: ["A Nicholas Ostler", "B Michael Krauss", "C Joseph E. Grimes", "D Sarah G. Thomason", "E Keneth L. Hale", "F Douglas H. Whalen"],
            answer: "A"
          },
          {
            id: "q38",
            number: 38,
            type: "matching_features",
            instructions: "Match each statement with the correct person, A–F.",
            text: "Not enough effort on saving languages until recent work",
            options: ["A Nicholas Ostler", "B Michael Krauss", "C Joseph E. Grimes", "D Sarah G. Thomason", "E Keneth L. Hale", "F Douglas H. Whalen"],
            answer: "D" // Sarah G Thomason says "It is only recently that it has become fashionable enough to work on endangered languages."
          },
          {
            id: "q39",
            number: 39,
            type: "multiple_choice",
            instructions: "Choose the correct letter, A, B, C or D.",
            text: "What is real result of master-apprentice program sponsored by The Ford Foundation?",
            options: ["A Teach children how to speak native languages", "B Revive some endangered languages in California", "C Postpone the dying date for some endangered languages", "D Increase communication between students"],
            answer: "C" // Text says "we prolong the survival of the language"
          },
          {
            id: "q40",
            number: 40,
            type: "multiple_choice",
            instructions: "Choose the correct letter, A, B, C or D.",
            text: "What should majority language speakers do according to the last paragraph?",
            options: ["A They should teach their children endangered languages", "B They should learn at least four languages", "C They should show their loyalty to a dying language", "D They should be more tolerant of minority language speakers"],
            answer: "D" // "persuade the world’s majorities to allow the minorities among them to speak with their own voices."
          }
        ]
      }
    ]
  }
];
