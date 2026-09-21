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
,
{
  "id": "mock-2",
  "title": "IELTS Academic Reading Practice Test 2",
  "passages": [
    {
      "id": "p1",
      "title": "The Extraordinary Watkin Tench",
      "text": "At the end of 18th century, life for the average British citizen was changing. The population grew as health and industrialisation took hold of the country. However, land and resources were limited. Families could not guarantee jobs for all of their children. People who were poor or destitute had little option. To make things worse, the rate of people who turned to crime to make a living increased. In Britain, the prisons were no longer large enough to hold the convicted people of this growing criminal class. Many towns and governments were at a loss as to what to do. However, another phenomenon that was happening in the 18th century was exploration of other continents. There were many ships looking for crew members who would risk a month-long voyage across a vast ocean. This job was risky and dangerous, so few would willingly choose it. However, with so many citizens without jobs or with criminal convictions, they had little choice. One such member of this new lower class of British citizens was Watkin Tench. Between 1788 and 1868, approximately 161,700 convicts were transported to the Australian colonies of New South Wales, Van Diemen\u2019s land and Western Australia. Tench was one of these unlucky convicts to sign onto a dangerous journey. When his ship set out in 1788, he signed a three years\u2019 service to the First Fleet.\n\nApart from his years in Australia, people knew little about his life back in Britain. It was said he was born on 6 October 1758 at Chester in the county of Cheshire in England. He came from a decent background. Tench was a son of Fisher Tench, a dancing master who ran a boarding school in the town and Margaritta Tarleton of the Liverpool Tarletons. He grew up around a finer class of British citizens, and his family helped instruct the children of the wealthy in formal dance lessons. Though we don\u2019t know for sure how Tench was educated in this small British town, we do know that he was well educated. His diaries from his travels to Australia are written in excellent English, a skill that not everyone was lucky to possess in the 18th century. Aside from this, we know little of Tench\u2019s beginnings. We don\u2019t know how he ended up convicted of a crime. But after he started his voyage, his life changed dramatically.\n\nDuring the voyage, which was harsh and took many months, Tench described landscape of different places. While sailing to Australia, Tench saw landscapes that were unfamiliar and new to him. Arriving in Australia, the entire crew was uncertain of what was to come in their new life. When they arrived in Australia, they established a British colony. Governor Philip was vested with complete authority over the inhabitants of the colony. Though still a young man, Philip was enlightened for his age. From stories of other British colonies, Philip learnt that conflict with the original peoples of the land was often a source of strife and difficulties. To avoid this, Philip\u2019s personal intent was to establish harmonious relations with local Aboriginal people. But Philip\u2019s job was even more difficult considering his crew. Other colonies were established with middle-class merchants and craftsmen. His crew were convicts, who had few other skills outside of their criminal histories. Along with making peace with the Aboriginal people, Philip also had to try to reform as well as discipline the convicts of the colony.\n\nFrom the beginning, Tench stood out as different from the other convicts. During his initial time in Australia, he quickly rose in his rank, and was given extra power and responsibility over the convicted crew members. However, he was also still very different from the upper-class rulers who came to rule over the crew. He showed humanity towards the convicted workers. He didn\u2019t want to treat them as common criminals, but as trained military men. Under Tench\u2019s authority, he released the convicts\u2019 chains which were used to control them during the voyage. Tench also showed mercy towards the Aboriginal people. Governor Philip often pursued violent solutions to conflicts with the Aboriginal peoples. Tench disagreed strongly with this method. At one point, he was unable to follow the order given by the Governor Philip to punish the ten Aboriginals.\n\nWhen they first arrived, Tench was fearful and contemptuous towards the Aboriginals, because the two cultures did not understand each other. However, gradually he got to know them individually and became close friends with them. Tench knew that the Aboriginal people would not cause them conflict if they looked for a peaceful solution. Though there continued to be conflict and violence, Tench\u2019s efforts helped establish a more peaceful negotiation between the two groups when they settled territory and land-use issues.\n\nMeanwhile, many changes were made to the new colony. The Hawkesbury River was named by Governor Philip in June 1789. Many native bird species to the river were hunted by travelling colonists. The colonists were having a great impact on the land and natural resources. Though the colonists had made a lot of progress in the untamed lands of Australia, there were still limits. The convicts were notoriously ill-informed about Australian geography, as was evident in the attempt by twenty absconders to walk from Sydney to China in 1791, believing: \u201cChina might be easily reached, being not more than a hundred miles distant, and separated only by a river.\u201d In reality, miles of ocean separated the two.\n\nMuch of Australia was unexplored by the convicts. Even Tench had little understanding of what existed beyond the established lines of their colony. Slowly, but surely, the colonists expanded into the surrounding area. A few days after arrival at Botany Bay, their original location, the fleet moved to the more suitable Port Jackson where a settlement was established at Sydney Cove on 26 January 1788. This second location was strange and unfamiliar, and the fleet was on alert for any kind of suspicious behaviors. Though Tench had made friends in Botany Bay with Aboriginal peoples, he could not be sure this new land would be uninhabited. He recalled the first time he stepped into this unfamiliar ground with a boy who helped Tench navigate. In these new lands, he met an old Aboriginal.",
      "questions": [
        {
          "id": "q1",
          "number": 1,
          "type": "true_false_not_given",
          "instructions": "Do the following statements agree with the information given in Reading Passage 1?\nChoose TRUE, FALSE or NOT GIVEN.",
          "text": "There was a great deal of information available about the life of Tench before he arrived in Australia.",
          "options": [
            "TRUE",
            "FALSE",
            "NOT GIVEN"
          ],
          "answer": "FALSE"
        },
        {
          "id": "q2",
          "number": 2,
          "type": "true_false_not_given",
          "instructions": "Do the following statements agree with the information given in Reading Passage 1?\nChoose TRUE, FALSE or NOT GIVEN.",
          "text": "Tench drew pictures to illustrate different places during the voyage.",
          "options": [
            "TRUE",
            "FALSE",
            "NOT GIVEN"
          ],
          "answer": "NOT GIVEN"
        },
        {
          "id": "q3",
          "number": 3,
          "type": "true_false_not_given",
          "instructions": "Do the following statements agree with the information given in Reading Passage 1?\nChoose TRUE, FALSE or NOT GIVEN.",
          "text": "Other military personnel in New South Wales did not treated convicts in the same way as Tench did.",
          "options": [
            "TRUE",
            "FALSE",
            "NOT GIVEN"
          ],
          "answer": "NOT GIVEN"
        },
        {
          "id": "q4",
          "number": 4,
          "type": "true_false_not_given",
          "instructions": "Do the following statements agree with the information given in Reading Passage 1?\nChoose TRUE, FALSE or NOT GIVEN.",
          "text": "Tench\u2019s view towards the Aboriginals remained unchanged during his time in Australia.",
          "options": [
            "TRUE",
            "FALSE",
            "NOT GIVEN"
          ],
          "answer": "FALSE"
        },
        {
          "id": "q5",
          "number": 5,
          "type": "true_false_not_given",
          "instructions": "Do the following statements agree with the information given in Reading Passage 1?\nChoose TRUE, FALSE or NOT GIVEN.",
          "text": "An Aboriginal gave him gifts of food at the first time they met.",
          "options": [
            "TRUE",
            "FALSE",
            "NOT GIVEN"
          ],
          "answer": "NOT GIVEN"
        },
        {
          "id": "q6",
          "number": 6,
          "type": "true_false_not_given",
          "instructions": "Do the following statements agree with the information given in Reading Passage 1?\nChoose TRUE, FALSE or NOT GIVEN.",
          "text": "The convicts had a good knowledge of Australian geography.",
          "options": [
            "TRUE",
            "FALSE",
            "NOT GIVEN"
          ],
          "answer": "FALSE"
        },
        {
          "id": "q7",
          "number": 7,
          "type": "fill_in_the_blanks",
          "instructions": "Answer the questions below. Choose NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage for each answer.",
          "text": "What could be a concrete proof of Tench\u2019s good education?",
          "answer": "His diaries"
        },
        {
          "id": "q8",
          "number": 8,
          "type": "fill_in_the_blanks",
          "instructions": "Answer the questions below. Choose NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage for each answer.",
          "text": "How many years did Tench sign the contract to the First Fleet?",
          "answer": "three years"
        },
        {
          "id": "q9",
          "number": 9,
          "type": "fill_in_the_blanks",
          "instructions": "Answer the questions below. Choose NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage for each answer.",
          "text": "What was used to control convicts during the voyage?",
          "answer": "chains"
        },
        {
          "id": "q10",
          "number": 10,
          "type": "fill_in_the_blanks",
          "instructions": "Answer the questions below. Choose NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage for each answer.",
          "text": "Who gave the order to punish the Aboriginals?",
          "answer": "Governor Philip"
        },
        {
          "id": "q11",
          "number": 11,
          "type": "fill_in_the_blanks",
          "instructions": "Answer the questions below. Choose NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage for each answer.",
          "text": "When did the name of Hawkesbury River come into being?",
          "answer": "June 1789"
        },
        {
          "id": "q12",
          "number": 12,
          "type": "fill_in_the_blanks",
          "instructions": "Answer the questions below. Choose NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage for each answer.",
          "text": "Where did the escaped convicts plan to go?",
          "answer": "China"
        },
        {
          "id": "q13",
          "number": 13,
          "type": "fill_in_the_blanks",
          "instructions": "Answer the questions below. Choose NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage for each answer.",
          "text": "In which place did Tench feel unaccustomed?",
          "answer": "Port Jackson"
        }
      ]
    },
    {
      "id": "p2",
      "title": "Are Artists Liars?",
      "text": "A Shortly before his death, Marlon Brando was working on a series of instructional videos about acting, to he called \u201cLying for a Living\u201d. On the surviving footage, Brando can be seen dispensing gnomic advice on his craft to a group of enthusiastic, if somewhat bemused, Hollywood stars, including Leonardo Di Caprio and Sean Penn. Brando also recruited random people from the Los Angeles street and persuaded them to improvise (the footage is said to include a memorable scene featuring two dwarves and a giant Samoan). \u201cIf you can lie, you can act.\u201d Brando told Jod Kaftan, a writer for Rolling Stone and one of the few people to have viewed the footage. \u201cAre you good at lying?\u201d asked Kaftan. \u201cJesus,\u201d said Brando, \u201cI'm fabulous at it\u201d.\n\nB Brando was not the first person to note that the line between an artist and a liar is a fine one. If art is a kind of lying, then lying is a form of art, albeit of a lower order\u2014as Oscar Wilde and Mark Twain have observed. Indeed, lying and artistic storytelling spring from a common neurological root\u2014one that is exposed in the cases of psychiatric patients who suffer from a particular kind of impairment. Both liars and artists refuse to accept the tyranny of reality. Both carefully craft stories that are worthy of belief\u2014a skill requiring intellectual sophistication, emotional sensitivity and physical self-control (liars are writers and performers of their own work). Such parallels are hardly coincidental, as I discovered while researching my book on lying.\n\nC A case study published in 1985 by Antonio Damasio, a neurologist, tells the story of a middle-aged woman with brain damage caused by a series of strokes. She retained cognitive abilities, including coherent speech, but what she actually said was rather unpredictable. Checking her knowledge of contemporary events, Damasio asked her about the Falklands War. In the language of psychiatry, this woman was \u201cconfabulating\u201d. Chronic confabulation is a rare type of memory problem that affects a small proportion of brain damaged people. In the literature it is defined as \u201cthe production of fabricated, distorted or misinterpreted memories about oneself or the world, without the conscious intention to deceive\u201d. Whereas amnesiacs make errors of omission\u2014there are gaps in their recollections they find impossible to fill\u2014confabulators make errors of commission: they make things up. Rather than forgetting, they are inventing. Confabulating patients are nearly always oblivious to their own condition, and will earnestly give absurdly implausible explanations of why they're in hospital, or talking to a doctor. One patient, asked about his surgical scar, explained that during the Second World War he surprised a teenage girl who shot him three times in the head, killing him, only for surgery to bring him back to life. The same patient, when asked about his family, described how at various times they had died in his arms, or had been killed before his eyes. Others tell yet more fantastical tales, about trips to the moon, fighting alongside Alexander in India or seeing Jesus on the Cross. Confabulators aren\u2019t out to deceive. They engage in what Morris Moscovitch, a neuropsychologist, calls \u201chonest lying\u201d. Uncertain and obscurely distressed by their uncertainty, they are seized by a \u201ccompulsion to narrate\u201d: a deep-seated need to shape, order and explain what they do not understand. Chronic confabulators are often highly inventive at the verbal level, jamming together words in nonsensical but suggestive ways: one patient, when asked what happened to Queen Marie Antoinette of France, answered that she had been \u201csuicided\u201d by her family. In a sense, these patients are like novelists, as described by Henry James: people on whom \u201cnothing is wasted\u201d. Unlike writers, however, they have little or no control over their own material.\n\nD The wider significance of this condition is what it tells us about ourselves. Evidently, there is a gushing river of verbal creativity in the normal human mind, from which both artistic invention and lying are drawn. We are born storytellers, spinning narrative out of our experience and imagination, straining against the leash that keeps us tethered to reality. This is a wonderful thing; it is what gives us our ability to conceive of alternative futures and different worlds. And it helps us to understand our own lives through the entertaining stories of others. But it can lead us into trouble, particularly when we try to persuade others that our inventions are real. Most of the time, as our stories bubble up to consciousness, we exercise our cerebral censors, controlling which stories we tell, and to whom. Yet people lie for all sorts of reasons, including the fact that confabulating can be dangerously fun.\n\nE During a now-famous libel case in 1996, Jonathan Aitken, a former cabinet minister, recounted a tale to illustrate the horrors he endured after a national newspaper tainted his name. The case, which stretched on for more than two years, involved a series of claims made by the Guardian about Aitken's relationships with Saudi arms dealers, including meetings he allegedly held with them on a trip to Paris while he was a government minister. What amazed many in hindsight was the sheer superfluity of the lies Aitken told during his testimony. Aitken\u2019s case collapsed in June 1997, when the defence finally found indisputable evidence about his Paris trip. Until then, Aitken's charm, fluency and flair for theatrical displays of sincerity looked as if they might bring him victory. They revealed that not only was Aitken\u2019s daughter not with him that day (when he was indeed doorstepped), but also that the minister had simply got into his car and drove off, with no vehicle in pursuit.\n\nF Of course, unlike Aitken, actors, playwrights and novelists are not literally attempting to deceive us, because the rules are laid out in advance: come to the theatre, or open this book, and we'll lie to you. Perhaps this is why we felt it necessary to invent art in the first place: as a safe space into which our lies can be corralled, and channeled into something socially useful. Given the universal compulsion to tell stories, art is the best way to refine and enjoy the particularly outlandish or insightful ones. But that is not the whole story. The key way in which artistic \u201clies\u201d differ from normal lies, and from the \u201chonest lying\u201d of chronic confabulators, is that they have a meaning and resonance beyond their creator. The liar lies on behalf of himself; the artist tells lies on behalf of everyone. If writers have a compulsion to narrate, they compel themselves to find insights about the human condition. Mario Vargas Llosa has written that novels \u201cexpress a curious truth that can only be expressed in a furtive and veiled fashion, masquerading as what it is not.\u201d Art is a lie whose secret ingredient is truth.",
      "questions": [
        {
          "id": "q14",
          "number": 14,
          "type": "matching_headings",
          "instructions": "Reading Passage 2 has six paragraphs, A-F. Choose the correct heading for each paragraph from the list of headings below.\nList of Headings\ni Unsuccessful deceit\nii Biological basis between liars and artists\niii How to lie in an artistic way\niv Confabulations and the exemplifiers\nv The distinction between artists and common liars\nvi The fine line between liars and artists\nvii The definition of confabulation\nviii Creativity when people lie",
          "text": "Paragraph A",
          "options": [
            "i",
            "ii",
            "iii",
            "iv",
            "v",
            "vi",
            "vii",
            "viii"
          ],
          "answer": "vi"
        },
        {
          "id": "q15",
          "number": 15,
          "type": "matching_headings",
          "instructions": "Choose the correct heading for each paragraph from the list of headings below.",
          "text": "Paragraph B",
          "options": [
            "i",
            "ii",
            "iii",
            "iv",
            "v",
            "vi",
            "vii",
            "viii"
          ],
          "answer": "ii"
        },
        {
          "id": "q16",
          "number": 16,
          "type": "matching_headings",
          "instructions": "Choose the correct heading for each paragraph from the list of headings below.",
          "text": "Paragraph C",
          "options": [
            "i",
            "ii",
            "iii",
            "iv",
            "v",
            "vi",
            "vii",
            "viii"
          ],
          "answer": "iv"
        },
        {
          "id": "q17",
          "number": 17,
          "type": "matching_headings",
          "instructions": "Choose the correct heading for each paragraph from the list of headings below.",
          "text": "Paragraph D",
          "options": [
            "i",
            "ii",
            "iii",
            "iv",
            "v",
            "vi",
            "vii",
            "viii"
          ],
          "answer": "viii"
        },
        {
          "id": "q18",
          "number": 18,
          "type": "matching_headings",
          "instructions": "Choose the correct heading for each paragraph from the list of headings below.",
          "text": "Paragraph E",
          "options": [
            "i",
            "ii",
            "iii",
            "iv",
            "v",
            "vi",
            "vii",
            "viii"
          ],
          "answer": "i"
        },
        {
          "id": "q19",
          "number": 19,
          "type": "matching_headings",
          "instructions": "Choose the correct heading for each paragraph from the list of headings below.",
          "text": "Paragraph F",
          "options": [
            "i",
            "ii",
            "iii",
            "iv",
            "v",
            "vi",
            "vii",
            "viii"
          ],
          "answer": "v"
        },
        {
          "id": "q20",
          "number": 20,
          "type": "multiple_choice",
          "instructions": "Choose TWO letters, A-E. Which TWO of the following statements about people suffering from confabulation are true?\n\nA They have lost cognitive abilities.\nB They do not deliberately tell a lie.\nC They are normally aware of their condition.\nD They do not have the impetus to explain what they do not understand.\nE They try to make up stories.",
          "text": "Choose one answer",
          "options": [
            "A",
            "B",
            "C",
            "D",
            "E"
          ],
          "answer": "B"
        },
        {
          "id": "q21",
          "number": 21,
          "type": "multiple_choice",
          "instructions": "Choose TWO letters, A-E. Which TWO of the following statements about people suffering from confabulation are true?",
          "text": "Choose one answer",
          "options": [
            "A",
            "B",
            "C",
            "D",
            "E"
          ],
          "answer": "E"
        },
        {
          "id": "q22",
          "number": 22,
          "type": "multiple_choice",
          "instructions": "Choose TWO letters, A-E. Which TWO of the following statements about playwrights and novelists are true?\n\nA They give more meaning to the stories.\nB They tell lies for the benefit of themselves.\nC They have nothing to do with the truth out there.\nD We can be misled by them if not careful.\nE We know there are lies in the content.",
          "text": "Choose one answer",
          "options": [
            "A",
            "B",
            "C",
            "D",
            "E"
          ],
          "answer": "A"
        },
        {
          "id": "q23",
          "number": 23,
          "type": "multiple_choice",
          "instructions": "Choose TWO letters, A-E. Which TWO of the following statements about playwrights and novelists are true?",
          "text": "Choose one answer",
          "options": [
            "A",
            "B",
            "C",
            "D",
            "E"
          ],
          "answer": "E"
        },
        {
          "id": "q24",
          "number": 24,
          "type": "fill_in_the_blanks",
          "instructions": "Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
          "text": "A [24] accused Jonathan Aitken, a former cabinet minister, who was selling and buying with [25].",
          "answer": "national newspaper"
        },
        {
          "id": "q25",
          "number": 25,
          "type": "fill_in_the_blanks",
          "instructions": "Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
          "text": "who was selling and buying with [25].",
          "answer": "arms dealers"
        },
        {
          "id": "q26",
          "number": 26,
          "type": "fill_in_the_blanks",
          "instructions": "Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
          "text": "Aitken\u2019s case collapsed in June 1997, when the defence finally found indisputable evidence about his Paris trip. He was deemed to have his [26].",
          "answer": "victory"
        }
      ]
    },
    {
      "id": "p3",
      "title": "Theory or Practice? \u2014 What is the point of research carried out by biz schools?",
      "text": "Students go to universities and other academic institutions to prepare for their future. We pay tuition and struggle through classes in the hopes that we can find a fulfilling and exciting career. But the choice of your university has a large influence on your future. How can you know which university will prepare you the best for your future? Like other academic institutions, business schools are judged by the quality of the research carried out by their faculties. Professors must both teach students and also produce original research in their own field. The quality of this research is assessed by academic publications. At the same time, universities have another responsibility to equip their students for the real world, however that is defined. Most students learning from professors will not go into academics themselves\u2014so how do academics best prepare them for their future careers, whatever that may be? Whether academic research actually produces anything that is useful to the practice of business, or even whether it is its job to do so, are questions that can provoke vigorous arguments on campus.\n\nThe debate, which first flared during the 1950s, was reignited in August, when AACSB International, the most widely recognised global accrediting agency for business schools, announced it would consider changing the way it evaluates research. The news followed rather damning criticism in 2002 from Jeffrey Pfeffer, a Stanford professor, and Christina Fong of Washington University, which questioned whether business education in its current guise was sustainable. The study found that traditional modes of academia were not adequately preparing students for the kind of careers they faced in current times. The most controversial recommendation in AACSB\u2019s draft report (which was sent round to administrators for their comment) is that the schools should be required to demonstrate the value of their faculties\u2019 research not simply by listing its citations in journals, but by demonstrating the impact it has in the professional world. New qualifiers, such as average incomes, student placement in top firms and business collaborations would now be considered just as important as academic publications.\n\nAACSB justifies its stance by saying that it wants schools and faculty to play to their strengths, whether they be in pedagogy, in the research of practical applications, or in scholarly endeavor. Traditionally, universities operate in a pyramid structure. Everyone enters and stays in an attempt to be successful in their academic field. A psychology professor must publish competitive research in the top neuroscience journals. A Cultural Studies professor must send graduate setups on new field research expeditions to be taken seriously. This research is the core of a university\u2019s output. And research of any kind is expensive\u2014AACSB points out that business schools in America alone spend more than $320m a year on it. So it seems legitimate to ask for what purpose it is undertaken?\n\nIf a school chose to specialise in professional outputs rather than academic outputs, it could use such a large sum of money and redirect it into more fruitful programs. For example, if a business school wanted a larger presence of employees at top financial firms, this money may be better spent on a career center which focuses on building the skills of students, rather than paying for more high-level research to be done through the effort of faculty. A change in evaluation could also open the door to inviting more professionals from different fields to teach as adjuncts. Students could take accredited courses from people who are currently working in their dream field. The AACSB insists that universities answer the question as to why research is the most critical component of traditional education.\n\nOn one level, the question is simple to answer. Research in business schools, as anywhere else, is about expanding the boundaries of knowledge; it thrives on answering unasked questions. Surely this pursuit of knowledge is still important to the university system. Our society progresses because we learn how to do things in new ways, a process which depends heavily on research and academics. But one cannot ignore the other obvious practical uses of research publications. Research is also about cementing schools\u2019 and professors' reputations. Schools gain kudos from their faculties\u2019 record of publication: which journals publish them, and how often. In some cases, such as with government-funded schools in Britain, it can affect how much money they receive. For professors, the mantra is often \u201cpublish or perish\u201d. Their careers depend on being seen in the right journals.\n\nBut at a certain point, one has to wonder whether this research is being done for the benefit of the university or for the students the university aims to teach. Greater publications will attract greater funding, which will in turn be spent on better publications. Students seeking to enter professions out of academia find this cycle frustrating, and often see their professors as being part of the \u201cIvory Tower\u201d of academia, operating in a self-contained community that has little influence on the outside world.\n\nThe research is almost universally unread by real-world managers. Part of the trouble is that the journals labour under a similar ethos. They publish more than 20,000 articles each year. Most of the research is highly quantitative, hypothesis-driven and esoteric. As a result, it is almost universally unread by real-world managers. Much of the research criticises other published research. A paper in a 2006 issue of Strategy & Leadership commented that \u201cresearch is not designed with managers\u2019 needs in mind, nor is it communicated in the journals they read. For the most part, it has become a self-referential closed system irrelevant to corporate performance.\u201d The AACSB demands that this segregation must change for the future of higher education. If students must invest thousands of dollars for an education as part of their career path, the academics which serve the students should be more fully incorporated into the professional world. This means that universities must focus on other strengths outside of research, such as professional networks, technology skills, and connections with top business firms around the world. Though many universities resisted the report, today\u2019s world continues to change. The universities which prepare students for our changing future have little choice but to change with new trends and new standards.",
      "questions": [
        {
          "id": "q27",
          "number": 27,
          "type": "multiple_choice",
          "instructions": "Choose the correct letter, A, B, C or D.",
          "text": "In the second paragraph, the recommendation given by AACSB is",
          "options": [
            "A to focus on listing research paper\u2019s citation only.",
            "B to consider the quantity of academic publications.",
            "C to evaluate how the paper influences the field.",
            "D to maintain the traditional modes of academia."
          ],
          "answer": "C"
        },
        {
          "id": "q28",
          "number": 28,
          "type": "multiple_choice",
          "instructions": "Choose the correct letter, A, B, C or D.",
          "text": "Why does AACSB put forward the recommendation?",
          "options": [
            "A to give full play to the faculties\u2019 advantage.",
            "B to reinforce the play to the pyramid structure of universities.",
            "C to push professors to publish competitive papers.",
            "D to reduce costs of research in universities."
          ],
          "answer": "A"
        },
        {
          "id": "q29",
          "number": 29,
          "type": "multiple_choice",
          "instructions": "Choose the correct letter, A, B, C or D.",
          "text": "Why does the author mention the Journal Strategy & Leadership?",
          "options": [
            "A to characterize research as irrelevant to company performance.",
            "B to suggest that managers don\u2019t read research papers.",
            "C to describe students\u2019 expectation for universities.",
            "D to exemplify high-quality research papers."
          ],
          "answer": "A"
        },
        {
          "id": "q30",
          "number": 30,
          "type": "multiple_choice",
          "instructions": "Choose TWO letters, A-E. Which TWO choices are in line with Jeffrey Pfeffer and Christina Fong\u2019s idea?",
          "text": "Choose one answer",
          "options": [
            "A Students should pay less to attend universities.",
            "B Business education is not doing their job well.",
            "C Professors should not focus on writing papers.",
            "D Students are ill-prepared for their career from universities.",
            "E Recognized accrediting agency can evaluate research well."
          ],
          "answer": "B"
        },
        {
          "id": "q31",
          "number": 31,
          "type": "multiple_choice",
          "instructions": "Choose TWO letters, A-E. Which TWO choices are in line with Jeffrey Pfeffer and Christina Fong\u2019s idea?",
          "text": "Choose one answer",
          "options": [
            "A Students should pay less to attend universities.",
            "B Business education is not doing their job well.",
            "C Professors should not focus on writing papers.",
            "D Students are ill-prepared for their career from universities.",
            "E Recognized accrediting agency can evaluate research well."
          ],
          "answer": "D"
        },
        {
          "id": "q32",
          "number": 32,
          "type": "true_false_not_given",
          "instructions": "Do the following statements agree with the information given in Reading Passage 3? Choose TRUE, FALSE or NOT GIVEN.",
          "text": "The debate about the usefulness of academic research for business practices is a recent one.",
          "options": [
            "TRUE",
            "FALSE",
            "NOT GIVEN"
          ],
          "answer": "FALSE"
        },
        {
          "id": "q33",
          "number": 33,
          "type": "true_false_not_given",
          "instructions": "Do the following statements agree with the information given in Reading Passage 3? Choose TRUE, FALSE or NOT GIVEN.",
          "text": "AACSB\u2019s draft report was not reviewed externally.",
          "options": [
            "TRUE",
            "FALSE",
            "NOT GIVEN"
          ],
          "answer": "FALSE"
        },
        {
          "id": "q34",
          "number": 34,
          "type": "true_false_not_given",
          "instructions": "Do the following statements agree with the information given in Reading Passage 3? Choose TRUE, FALSE or NOT GIVEN.",
          "text": "Business schools in the US spend more than 320 million dollars yearly on research.",
          "options": [
            "TRUE",
            "FALSE",
            "NOT GIVEN"
          ],
          "answer": "TRUE"
        },
        {
          "id": "q35",
          "number": 35,
          "type": "true_false_not_given",
          "instructions": "Do the following statements agree with the information given in Reading Passage 3? Choose TRUE, FALSE or NOT GIVEN.",
          "text": "Many universities pursue professional outputs.",
          "options": [
            "TRUE",
            "FALSE",
            "NOT GIVEN"
          ],
          "answer": "NOT GIVEN"
        },
        {
          "id": "q36",
          "number": 36,
          "type": "true_false_not_given",
          "instructions": "Do the following statements agree with the information given in Reading Passage 3? Choose TRUE, FALSE or NOT GIVEN.",
          "text": "Greater publications benefit professors and students as well.",
          "options": [
            "TRUE",
            "FALSE",
            "NOT GIVEN"
          ],
          "answer": "FALSE"
        },
        {
          "id": "q37",
          "number": 37,
          "type": "multiple_choice",
          "instructions": "Complete each sentence with the correct ending, A-E, below.",
          "text": "Most professors support academic research because",
          "options": [
            "A it progresses as we learn innovative ways of doing things.",
            "B the trends and standards are changing.",
            "C their jobs depend on it.",
            "D they care about their school rankings and government funds.",
            "E it helps students to go into top business firms."
          ],
          "answer": "C"
        },
        {
          "id": "q38",
          "number": 38,
          "type": "multiple_choice",
          "instructions": "Complete each sentence with the correct ending, A-E, below.",
          "text": "Schools support academic research because",
          "options": [
            "A it progresses as we learn innovative ways of doing things.",
            "B the trends and standards are changing.",
            "C their jobs depend on it.",
            "D they care about their school rankings and government funds.",
            "E it helps students to go into top business firms."
          ],
          "answer": "D"
        },
        {
          "id": "q39",
          "number": 39,
          "type": "multiple_choice",
          "instructions": "Complete each sentence with the correct ending, A-E, below.",
          "text": "Our society needs academic research because",
          "options": [
            "A it progresses as we learn innovative ways of doing things.",
            "B the trends and standards are changing.",
            "C their jobs depend on it.",
            "D they care about their school rankings and government funds.",
            "E it helps students to go into top business firms."
          ],
          "answer": "A"
        },
        {
          "id": "q40",
          "number": 40,
          "type": "multiple_choice",
          "instructions": "Complete each sentence with the correct ending, A-E, below.",
          "text": "Universities resisting the AACSB should change because",
          "options": [
            "A it progresses as we learn innovative ways of doing things.",
            "B the trends and standards are changing.",
            "C their jobs depend on it.",
            "D they care about their school rankings and government funds.",
            "E it helps students to go into top business firms."
          ],
          "answer": "B"
        }
      ]
    }
  ]
}
];
