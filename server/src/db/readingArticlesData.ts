export interface SeedArticle {
  id: string;
  level: 'A2' | 'B1' | 'B2';
  title: string;
  content: string;
  key_concepts: string;
}

export const ALL_60_ARTICLES: SeedArticle[] = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // LEVEL A2 - ELEMENTARY (20 Articles)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'a2-01',
    level: 'A2',
    title: 'The Tallest Mammals',
    content: 'Giraffes are the tallest mammals on Earth. They live in Africa. A giraffe has a very long neck, but it has only seven bones in its neck. This is the same number of bones as a human has. Giraffes eat leaves from high trees. Their favorite food is the acacia tree. A giraffe has a long, blue tongue to help it pull leaves from branches. They do not drink a lot of water because they get water from the leaves they eat.',
    key_concepts: JSON.stringify(['giraffes', 'tallest mammals', 'Africa', 'seven bones in neck', 'same as human', 'acacia tree', 'blue tongue', 'leaves', 'branches', 'little water'])
  },
  {
    id: 'a2-02',
    level: 'A2',
    title: 'Penguin Families',
    content: 'Penguins are birds that live in very cold places. They cannot fly in the air, but they swim very well in water. Penguins eat fish and other small animals. Baby penguins are called chicks. The mother and father penguin work together to keep the chick warm. Penguins live in large groups called colonies. These colonies can have thousands of penguins. Penguins are black and white. They have thick fur to keep them warm in the ice and snow.',
    key_concepts: JSON.stringify(['penguins', 'cold places', 'cannot fly', 'swim very well', 'eat fish', 'chicks', 'mother and father', 'colonies', 'thousands', 'black and white', 'thick fur'])
  },
  {
    id: 'a2-03',
    level: 'A2',
    title: 'The Amazon Rainforest',
    content: 'The Amazon is a huge rainforest in South America. It is very hot and wet there. Many animals live in the Amazon. There are snakes, jaguars, and colorful birds. The rainforest has many trees and plants. People who live there use the forest for food and medicine. Scientists study the rainforest to learn about nature. The Amazon is very important for our planet. Trees in the rainforest make oxygen for us to breathe.',
    key_concepts: JSON.stringify(['Amazon', 'rainforest', 'South America', 'hot and wet', 'snakes and jaguars', 'colorful birds', 'food and medicine', 'scientists', 'oxygen'])
  },
  {
    id: 'a2-04',
    level: 'A2',
    title: 'Honey Bees',
    content: 'Honey bees are very important insects. They make honey from flowers. Bees live together in a hive with thousands of other bees. Each bee has a job to do. Some bees find flowers and collect pollen. Other bees make the honey. The queen bee is the mother of all bees in the hive. Worker bees are female and male bees are called drones. Bees dance to tell other bees where flowers are.',
    key_concepts: JSON.stringify(['honey bees', 'flowers', 'hive', 'pollen', 'queen bee', 'worker bees female', 'drones male', 'bees dance'])
  },
  {
    id: 'a2-05',
    level: 'A2',
    title: 'The Great Wall of China',
    content: 'The Great Wall of China is a very long wall. It was built many hundred years ago. The wall is very tall and strong. It goes across mountains and deserts. People built it to protect China from enemies. Now, many tourists visit the Great Wall every year. It is one of the most famous buildings in the world. The wall is made of stone and brick. You can walk on top of the wall and see for miles.',
    key_concepts: JSON.stringify(['Great Wall of China', 'hundred years ago', 'mountains and deserts', 'protect from enemies', 'tourists', 'stone and brick', 'walk on top'])
  },
  {
    id: 'a2-06',
    level: 'A2',
    title: 'Polar Bears',
    content: 'Polar bears live in the Arctic. It is very cold there with lots of ice and snow. Polar bears are white to blend with the snow. They are very big and strong animals. Polar bears eat mainly seals. They hunt on the ice. A baby polar bear is called a cub. The mother bear teaches the cub how to hunt and swim. Polar bears are excellent swimmers. They can swim for many hours in cold water.',
    key_concepts: JSON.stringify(['polar bears', 'Arctic', 'ice and snow', 'blend with snow', 'eat seals', 'hunt on ice', 'cub', 'mother bear', 'excellent swimmers'])
  },
  {
    id: 'a2-07',
    level: 'A2',
    title: 'Making Chocolate',
    content: 'Chocolate comes from cocoa beans. Cocoa beans grow inside large pods on cocoa trees. These trees grow in tropical countries. Workers pick the pods and take out the beans. The beans are dried in the sun. Then they are shipped to factories. In the factory, workers roast the beans. The beans are ground into powder. Sugar and milk are added to make chocolate. Chocolate tastes sweet and is loved by many people.',
    key_concepts: JSON.stringify(['chocolate', 'cocoa beans', 'pods', 'cocoa trees', 'tropical countries', 'dried in sun', 'factories', 'roast', 'ground into powder', 'sugar and milk'])
  },
  {
    id: 'a2-08',
    level: 'A2',
    title: 'Dolphins',
    content: 'Dolphins are very smart animals. They live in the ocean. Dolphins breathe air, so they come to the surface to breathe. They eat fish and small sea animals. Dolphins live in groups called pods. They communicate with each other by making sounds. Dolphins play and hunt together. They are friendly to humans. Baby dolphins are called calves. Mother dolphins take care of their calves for many years.',
    key_concepts: JSON.stringify(['dolphins', 'smart animals', 'ocean', 'breathe air', 'surface', 'eat fish', 'pods', 'communicate sounds', 'friendly to humans', 'calves'])
  },
  {
    id: 'a2-09',
    level: 'A2',
    title: 'The Pyramid of Giza',
    content: 'The Pyramid of Giza is in Egypt. It is one of the oldest buildings in the world. It was built about four thousand five hundred years ago. The pyramid is very large and very tall. Thousands of workers built it. They moved huge stone blocks into place. The pyramid was built as a tomb for a king. Inside the pyramid are rooms and passages. Many tourists visit the pyramid every year to see it.',
    key_concepts: JSON.stringify(['Pyramid of Giza', 'Egypt', 'four thousand five hundred years ago', 'thousands of workers', 'huge stone blocks', 'tomb for king', 'rooms and passages', 'tourists'])
  },
  {
    id: 'a2-10',
    level: 'A2',
    title: 'Butterflies',
    content: 'Butterflies are beautiful insects. They have colorful wings. Butterflies start as caterpillars. A caterpillar eats leaves all day. Then it becomes a chrysalis. Inside the chrysalis, the caterpillar changes into a butterfly. When it comes out, it has wings. The butterfly drinks nectar from flowers. Butterflies fly from flower to flower. They help pollinate plants. Butterflies live for only a few weeks.',
    key_concepts: JSON.stringify(['butterflies', 'colorful wings', 'caterpillars', 'eats leaves', 'chrysalis', 'drinks nectar', 'pollinate plants', 'few weeks'])
  },
  {
    id: 'a2-11',
    level: 'A2',
    title: 'The Statue of Liberty',
    content: 'The Statue of Liberty is in New York. It is a very tall statue. The statue shows a woman holding a torch. It was a gift from France to America. The statue is made of copper. It is green because the copper has changed color over time. Visitors can go inside the statue and climb to the top. From the top, you can see the whole city. The statue is a symbol of freedom.',
    key_concepts: JSON.stringify(['Statue of Liberty', 'New York', 'woman holding torch', 'gift from France', 'copper', 'turned green', 'climb to top', 'symbol of freedom'])
  },
  {
    id: 'a2-12',
    level: 'A2',
    title: 'The Water Cycle',
    content: 'Water moves around our planet in a cycle. The sun heats water in the ocean. The water becomes a gas called vapor. This vapor rises into the air. High in the sky, it becomes cold and turns into clouds. When clouds get heavy, water falls as rain. Rain flows into rivers and returns to the ocean. Then the cycle starts again. This cycle is called the water cycle. It happens all the time.',
    key_concepts: JSON.stringify(['water cycle', 'sun heats water', 'vapor', 'rises into air', 'clouds', 'heavy', 'rain', 'rivers and ocean', 'cycle starts again'])
  },
  {
    id: 'a2-13',
    level: 'A2',
    title: 'Kangaroos',
    content: 'Kangaroos live in Australia. They are very large animals. Kangaroos have strong back legs. They use these legs to jump very far and very fast. A kangaroo can jump up to thirty feet in one jump. Kangaroos eat grass and leaves. They live in groups. A baby kangaroo is called a joey. The joey lives in a pouch on the mother kangaroo. Kangaroos are herbivores, so they only eat plants.',
    key_concepts: JSON.stringify(['kangaroos', 'Australia', 'strong back legs', 'jump thirty feet', 'grass and leaves', 'groups', 'joey', 'pouch', 'herbivores'])
  },
  {
    id: 'a2-14',
    level: 'A2',
    title: 'Rice Farming',
    content: 'Rice is a very important food crop. Billions of people eat rice every day. Rice grows in wet fields called paddies. Farmers plant rice seeds in the wet soil. The rice plants need lots of water. Workers watch the fields and remove weeds. When the rice is ready, it turns gold. Farmers cut down the rice plants. They dry the rice and remove the outer shell. Then the rice is ready to eat.',
    key_concepts: JSON.stringify(['rice', 'billions of people', 'paddies', 'wet soil', 'needs water', 'remove weeds', 'turns gold', 'dry the rice', 'outer shell'])
  },
  {
    id: 'a2-15',
    level: 'A2',
    title: 'Owls',
    content: 'Owls are birds that hunt at night. They sleep during the day. Owls have very big eyes that see well in the dark. They also have excellent hearing. Owls can turn their heads almost completely around. They eat small animals like mice and rats. Owls make a hooting sound that you can hear far away. Some owls are very big, and some are very small. All owls are hunters and carnivores.',
    key_concepts: JSON.stringify(['owls', 'hunt at night', 'sleep day', 'big eyes', 'excellent hearing', 'turn heads around', 'mice and rats', 'hooting sound', 'carnivores'])
  },
  {
    id: 'a2-16',
    level: 'A2',
    title: 'Volcanoes',
    content: 'Volcanoes are mountains that can explode. Under the ground, there is hot melted rock called magma. When pressure builds up, the volcano erupts. Hot magma comes out of the volcano. It is called lava when it is outside. Lava destroys everything in its path. Volcanoes can be very dangerous. Some volcanoes sleep for hundreds of years. Others erupt many times. Scientists study volcanoes to understand them better.',
    key_concepts: JSON.stringify(['volcanoes', 'mountains explode', 'magma', 'pressure builds', 'erupts', 'lava', 'destroys everything', 'sleep hundreds years', 'scientists'])
  },
  {
    id: 'a2-17',
    level: 'A2',
    title: 'Tea Growing',
    content: 'Tea is one of the most popular drinks in the world. Tea comes from the leaves of a special tea plant. The tea plant grows in warm, wet places. Workers pick the young leaves from the plant. The leaves are dried and rolled. Different types of tea are made in different ways. Some tea is green, and some is black. People add hot water to the leaves to make tea. Tea has many health benefits.',
    key_concepts: JSON.stringify(['tea', 'leaves', 'special tea plant', 'warm wet places', 'pick young leaves', 'dried and rolled', 'green and black', 'hot water', 'health benefits'])
  },
  {
    id: 'a2-18',
    level: 'A2',
    title: 'Deserts',
    content: 'Deserts are very dry places. It rains very little in deserts. The sand is very hot during the day and very cold at night. Few plants and animals can live in the desert. Some animals sleep during the day and hunt at night. Desert plants store water in their leaves and roots. The Sahara is the biggest desert in the world. Deserts cover almost a quarter of Earth. Some deserts are covered in sand, and others have rocks.',
    key_concepts: JSON.stringify(['deserts', 'very dry', 'hot day cold night', 'sleep day hunt night', 'store water', 'Sahara biggest desert', 'quarter of Earth', 'sand and rocks'])
  },
  {
    id: 'a2-19',
    level: 'A2',
    title: 'Koalas',
    content: 'Koalas live in Australia. They spend almost all their time in trees. Koalas eat eucalyptus leaves. These leaves are their main food. A koala eats for many hours every day. Baby koalas are called joeys. Joeys ride on their mother back. Koalas sleep about twenty hours a day. They are not very active animals. Koalas are not bears, even though they look like bears.',
    key_concepts: JSON.stringify(['koalas', 'Australia', 'trees', 'eucalyptus leaves', 'main food', 'joeys', 'mother back', 'sleep twenty hours', 'not bears'])
  },
  {
    id: 'a2-20',
    level: 'A2',
    title: 'Paper Making',
    content: 'Paper is made from trees. Workers cut down trees and take off the bark. The wood is broken into small pieces. These pieces are cooked in special chemicals. This makes a soft material called pulp. The pulp is washed and cleaned. It is spread on large screens. As it dries, it becomes paper. Different papers are made for different uses. Newspaper, cardboard, and writing paper are all made this way.',
    key_concepts: JSON.stringify(['paper', 'trees', 'bark', 'small pieces', 'cooked in chemicals', 'pulp', 'washed and cleaned', 'screens', 'newspaper and cardboard'])
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // LEVEL B1 - INTERMEDIATE (20 Articles)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'b1-01',
    level: 'B1',
    title: 'The Dawn of Computing',
    content: 'Early computing began long before modern electronic devices existed. One of the first mechanical computers was the Analytical Engine, designed by Charles Babbage in the eighteen thirties. It used punch cards for input and could perform complex mathematical calculations. Ada Lovelace is often considered the first computer programmer because she wrote an algorithm for this machine. The transition to electronic computers happened during World War Two with machines like ENIAC. These massive computers used vacuum tubes, generated enormous heat, and filled entire rooms, yet they were less powerful than a simple modern smartphone.',
    key_concepts: JSON.stringify(['early computing', 'Analytical Engine', 'Charles Babbage', 'eighteen thirties', 'punch cards', 'Ada Lovelace', 'first computer programmer', 'algorithm', 'World War Two', 'ENIAC', 'vacuum tubes', 'smartphone'])
  },
  {
    id: 'b1-02',
    level: 'B1',
    title: 'The Renaissance Period',
    content: 'The Renaissance was a period of great cultural change in Europe between the fourteenth and seventeenth centuries. It marked the transition from medieval times to the modern era. During this time, there was a revival of interest in classical Greek and Roman knowledge. Artists like Michelangelo and Leonardo da Vinci created masterpieces that are still admired today. The Renaissance spread new ideas about science, art, and literature throughout Europe. Printing technology allowed books to be produced more quickly, helping spread these ideas. Universities were established, and education became more widespread. This period laid the foundation for modern science and philosophy.',
    key_concepts: JSON.stringify(['Renaissance', 'cultural change', 'Europe', 'fourteenth and seventeenth centuries', 'Greek and Roman knowledge', 'Michelangelo', 'Leonardo da Vinci', 'printing technology', 'universities', 'modern science'])
  },
  {
    id: 'b1-03',
    level: 'B1',
    title: 'The Water Clock',
    content: 'Before mechanical clocks were invented, people used water clocks to measure time. The oldest known water clock was built by the Egyptians around fifteen hundred BC. Water clocks work by allowing water to flow from one container to another at a constant rate. As water level changes, markings on the container indicate passage of time. Different civilizations developed more sophisticated water clocks with gears and mechanisms. Water clocks were used in ancient Greece, Rome, China, and the Islamic world. They provided a reliable way to measure time and were used for various purposes including navigation and religious ceremonies. Despite their effectiveness, water clocks gradually became obsolete with invention of mechanical clocks.',
    key_concepts: JSON.stringify(['mechanical clocks', 'water clocks', 'measure time', 'Egyptians', 'fifteen hundred BC', 'constant rate', 'markings on container', 'Greece Rome China', 'navigation', 'obsolete'])
  },
  {
    id: 'b1-04',
    level: 'B1',
    title: 'Coral Reefs',
    content: 'Coral reefs are among the most diverse ecosystems on Earth. They form in shallow, warm ocean waters where tiny animals called polyps build colonies. These polyps create hard structures using calcium from seawater. Many fish and other sea creatures depend on coral reefs for food and shelter. A single coral reef can contain thousands of species. Some coral reefs are thousands of years old. However, coral reefs face serious threats from climate change, pollution, and overfishing. Rising ocean temperatures cause coral bleaching, which weakens and kills the coral. Many scientists are working to protect and restore damaged coral reefs. These efforts are crucial for maintaining ocean biodiversity and protecting human communities that depend on reefs.',
    key_concepts: JSON.stringify(['coral reefs', 'diverse ecosystems', 'polyps', 'calcium from seawater', 'food and shelter', 'thousands of species', 'climate change', 'pollution', 'coral bleaching', 'ocean biodiversity'])
  },
  {
    id: 'b1-05',
    level: 'B1',
    title: 'The Silk Road',
    content: 'The Silk Road was an extensive network of trade routes that connected East and West for more than fifteen hundred years. It began during the Han Dynasty in China and extended across Asia, reaching Europe and the Middle East. The routes were named for silk, a valuable commodity traded from China westward. However, the Silk Road was not just about silk. Merchants traded spices, precious metals, ceramics, and glass along these routes. Beyond goods, ideas, religions, and technologies traveled the Silk Road. Buddhism spread from India to East Asia through these routes. The Silk Road declined with the rise of sea trade and the fall of the Mongol Empire. Despite its decline, the Silk Road left a lasting impact on cultures and economies.',
    key_concepts: JSON.stringify(['Silk Road', 'trade routes', 'fifteen hundred years', 'Han Dynasty', 'China to Europe', 'silk', 'spices and ceramics', 'Buddhism', 'sea trade', 'Mongol Empire'])
  },
  {
    id: 'b1-06',
    level: 'B1',
    title: 'The Northern Lights',
    content: 'The Northern Lights, also called the Aurora Borealis, are natural phenomena that occur in Arctic regions. They appear as colorful lights dancing across the night sky, typically displaying shades of green, purple, and red. The Northern Lights are caused by interactions between the solar wind and Earth magnetic field. When charged particles from the sun collide with gases in the atmosphere, they produce these spectacular displays. The Northern Lights are most visible near the Arctic Circle during winter months. Indigenous peoples living in the north have witnessed these lights for thousands of years and developed many cultural stories about them. The Northern Lights attract thousands of tourists to countries like Norway, Finland, and Iceland. Scientists continue to study the Northern Lights to better understand solar activity and Earth magnetism.',
    key_concepts: JSON.stringify(['Northern Lights', 'Aurora Borealis', 'Arctic regions', 'green purple red', 'solar wind', 'Earth magnetic field', 'charged particles', 'winter months', 'Norway Finland Iceland', 'solar activity'])
  },
  {
    id: 'b1-07',
    level: 'B1',
    title: 'Coffee Production',
    content: 'Coffee is one of the world most important agricultural products, enjoyed by billions of people daily. Coffee plants grow best in warm, tropical regions on high altitude slopes. The coffee plant produces red berries containing two seeds, which are the coffee beans. Harvesting coffee requires skilled labor as workers must pick ripe berries at exactly the right time. After harvesting, the beans are processed and dried, a process that can take several weeks. The dried beans are roasted at high temperatures, developing the characteristic coffee flavor and aroma. Different roasting levels produce different flavors from light and bright to dark and bold. Coffee production involves complex trade networks and economic relationships between producing nations and consuming countries. The coffee industry faces challenges from climate change, which threatens the regions where coffee grows best.',
    key_concepts: JSON.stringify(['coffee production', 'tropical regions', 'high altitude slopes', 'red berries', 'coffee beans', 'harvesting ripe berries', 'dried and roasted', 'high temperatures', 'flavor and aroma', 'climate change'])
  },
  {
    id: 'b1-08',
    level: 'B1',
    title: 'The Maya Civilization',
    content: 'The Maya civilization was one of the most advanced ancient civilizations in the Americas. The Maya developed sophisticated systems for writing, mathematics, and astronomy. They invented a calendar system that was remarkably accurate. The Maya built impressive cities with large pyramids, temples, and palaces. They developed agriculture, growing maize, beans, and squash. The Maya made important discoveries in mathematics, including the concept of zero. Their artistic achievements include beautiful paintings, sculptures, and pottery. The civilization declined around nine hundred AD, though the reasons remain debated among historians. Despite the decline of major cities, Maya culture continued in smaller communities. Today, descendants of the Maya still live in Central America, preserving many cultural traditions.',
    key_concepts: JSON.stringify(['Maya civilization', 'Americas', 'writing and mathematics', 'astronomy', 'accurate calendar', 'pyramids and temples', 'maize beans squash', 'concept of zero', 'declined nine hundred AD', 'Central America'])
  },
  {
    id: 'b1-09',
    level: 'B1',
    title: 'Photography',
    content: 'Photography emerged as a new technology during the nineteenth century. Early cameras required long exposure times and complex chemical processes. The first successful photograph was taken by Nicéphore Niépce in eighteen twenty-six. The invention of the roll film in eighteen eighty-five made photography more accessible to ordinary people. Black and white photography dominated for decades until color film became practical in the mid-twentieth century. Photography changed art, journalism, and how people documented their lives. Cameras became smaller and easier to use, eventually leading to digital photography. The digital revolution transformed photography by eliminating need for film and chemical development. Today, smartphones with powerful cameras have made photography something everyone can do. Photography continues to evolve as technology advances, with new possibilities constantly emerging.',
    key_concepts: JSON.stringify(['photography', 'nineteenth century', 'exposure times', 'Nicéphore Niépce', 'eighteen twenty-six', 'roll film eighteen eighty-five', 'black and white', 'color film', 'digital revolution', 'smartphones'])
  },
  {
    id: 'b1-10',
    level: 'B1',
    title: 'Wind Energy',
    content: 'Wind energy is one of the fastest growing renewable energy sources worldwide. Wind turbines convert the kinetic energy of wind into electrical energy. Modern wind turbines are impressive engineering achievements, with some reaching heights of over two hundred meters. Wind farms can be built on land or offshore in coastal waters. Offshore wind farms can generate more electricity because ocean winds are generally stronger and more consistent. Wind energy produces no emissions and requires minimal maintenance once installed. However, wind energy has some challenges including the variability of wind and potential impact on bird populations. Wind power currently supplies a significant portion of electricity in several countries, particularly Denmark, Germany, and Portugal. Investment in wind energy continues to grow as nations work to reduce dependence on fossil fuels.',
    key_concepts: JSON.stringify(['wind energy', 'renewable energy', 'wind turbines', 'kinetic to electrical', 'two hundred meters', 'offshore wind farms', 'no emissions', 'variability of wind', 'Denmark Germany Portugal', 'fossil fuels'])
  },
  {
    id: 'b1-11',
    level: 'B1',
    title: 'The Roman Aqueduct System',
    content: 'The Roman aqueduct system is one of the greatest engineering achievements of ancient times. Aqueducts were structures designed to transport water from distant sources to cities. The Romans built hundreds of kilometers of aqueducts over several centuries. Some aqueducts were built above ground with characteristic arched structures, while others ran underground. The engineering required understanding of slope and gravity to keep water flowing. The Pont du Gard in France is one of the best preserved Roman aqueducts and remains an impressive testament to Roman engineering. Aqueducts were essential for supplying water to growing Roman cities for drinking, bathing, and irrigation. The construction of aqueducts required enormous labor and resources but demonstrated Roman commitment to urban development. Many Roman aqueducts continued to function for over two thousand years.',
    key_concepts: JSON.stringify(['Roman aqueduct system', 'transport water', 'hundreds of kilometers', 'arched structures', 'underground', 'slope and gravity', 'Pont du Gard', 'drinking and bathing', 'two thousand years'])
  },
  {
    id: 'b1-12',
    level: 'B1',
    title: 'The History of Writing Systems',
    content: 'Writing systems developed independently in several parts of the world as civilizations grew more complex. The earliest known writing system, cuneiform, developed in Mesopotamia around thirty two hundred BC. Egyptian hieroglyphics emerged around the same time as another sophisticated writing system. The Chinese writing system developed independently and has remained in continuous use for over three thousand years. Alphabetic writing systems, which represent individual sounds, emerged later and are more efficient than logographic systems. The Phoenicians developed one of the first alphabets around one thousand BC. The Greek alphabet, derived from Phoenician, became the foundation for many modern European alphabets. Latin alphabet, used for English and many other languages, ultimately derives from Greek. Writing systems revolutionized human civilization by allowing information to be preserved and transmitted across generations.',
    key_concepts: JSON.stringify(['writing systems', 'cuneiform', 'Mesopotamia', 'thirty two hundred BC', 'Egyptian hieroglyphics', 'Chinese writing', 'Phoenicians alphabet', 'Greek alphabet', 'Latin alphabet', 'preserved information'])
  },
  {
    id: 'b1-13',
    level: 'B1',
    title: 'Marine Biodiversity',
    content: 'Marine biodiversity refers to the variety of life forms found in oceans and seas. The ocean covers more than seventy percent of Earth surface but much remains unexplored. Marine ecosystems include coral reefs, kelp forests, and deep-sea hydrothermal vents. Each ecosystem supports unique communities of organisms adapted to their specific environments. Fish represent the largest group of marine vertebrates, with over thirty thousand species. Marine mammals including whales, dolphins, and seals are found in every ocean. Invertebrates such as squid, octopus, and crustaceans are incredibly diverse. Marine plants, particularly phytoplankton, form the base of many marine food chains. The ocean absorbs carbon dioxide, helping regulate Earth climate. However, overfishing, pollution, and climate change threaten marine biodiversity. Protecting ocean ecosystems is essential for maintaining the health of the planet.',
    key_concepts: JSON.stringify(['marine biodiversity', 'seventy percent of Earth', 'coral reefs', 'kelp forests', 'hydrothermal vents', 'thirty thousand species', 'marine mammals', 'phytoplankton', 'absorbs carbon dioxide', 'overfishing and pollution'])
  },
  {
    id: 'b1-14',
    level: 'B1',
    title: 'The Development of Electricity',
    content: 'Electricity has profoundly shaped modern civilization, yet its discovery and development took centuries. Early observations of electrical phenomena date back to ancient times when people noticed that rubbing amber produced static electricity. Benjamin Franklin conducted experiments with electricity and introduced the concept of positive and negative charges. Volta invented the first electric battery, providing a consistent source of electrical current. Faraday discovered electromagnetic induction, establishing the relationship between electricity and magnetism. Edison developed the practical electric light bulb and created the first electrical power station. Tesla pioneered alternating current technology, which became the standard for electrical distribution. The development of electricity required contributions from numerous scientists and inventors over many generations. Electrical technology enabled the industrial revolution and laid the foundation for modern technology.',
    key_concepts: JSON.stringify(['electricity', 'rubbing amber', 'Benjamin Franklin', 'positive and negative', 'Volta battery', 'Faraday electromagnetic induction', 'Edison light bulb', 'Tesla alternating current', 'industrial revolution'])
  },
  {
    id: 'b1-15',
    level: 'B1',
    title: 'Medieval Architecture',
    content: 'Medieval architecture developed in Europe during the Middle Ages, roughly from the fifth to the fifteenth centuries. Early medieval architecture was heavily influenced by Roman building traditions. The Romanesque style emerged around the eleventh century, characterized by rounded arches and thick walls. Gothic architecture developed in the twelfth century, introducing pointed arches and flying buttresses that allowed for taller structures. Gothic cathedrals represent some of the greatest achievements of medieval architecture, with soaring heights and intricate details. Medieval castles served as both defensive fortifications and residences for nobles. Architectural innovations during the medieval period included the development of stone masonry techniques and structural systems. Medieval architecture reflected both religious devotion and secular power. Many medieval buildings have survived centuries and remain important cultural heritage sites.',
    key_concepts: JSON.stringify(['medieval architecture', 'Middle Ages', 'fifth to fifteenth centuries', 'Romanesque style', 'rounded arches', 'Gothic architecture', 'pointed arches', 'flying buttresses', 'cathedrals', 'castles'])
  },
  {
    id: 'b1-16',
    level: 'B1',
    title: 'The Industrial Revolution',
    content: 'The Industrial Revolution marked a dramatic shift in human economic and social history. Beginning in Britain in the late eighteenth century, it spread throughout Europe and North America. The revolution centered on the development of steam power and mechanical manufacturing. Factories replaced cottage industries as the primary location of production. The steam engine, improved by James Watt, powered mills, mines, and transportation. Coal became the primary energy source, driving economic growth. Textiles, iron, and steel became major industries. Urbanization accelerated as people moved from rural areas to cities to work in factories. Labor conditions in factories were often harsh, with long hours and low wages. The Industrial Revolution created the modern working class and sparked development of labor movements.',
    key_concepts: JSON.stringify(['Industrial Revolution', 'Britain', 'eighteenth century', 'steam power', 'factories', 'James Watt', 'coal energy source', 'textiles iron steel', 'urbanization', 'labor movements'])
  },
  {
    id: 'b1-17',
    level: 'B1',
    title: 'The Spread of Agriculture',
    content: 'Agriculture emerged independently in several regions around the world roughly ten thousand years ago. The transition from hunting-gathering to farming fundamentally changed human civilization. In the Fertile Crescent, wheat and barley were domesticated around ten thousand BC. Rice agriculture developed in Southeast Asia, becoming the primary crop for billions of people. Maize, beans, and squash were domesticated in Mesoamerica. Agriculture allowed populations to grow and settlements to become permanent. The surplus food produced by agriculture supported the development of cities and complex societies. Different regions developed distinct agricultural systems suited to their climates and available plants. Crop domestication involved hundreds of generations of selective breeding. Animals were also domesticated for food, labor, and transportation.',
    key_concepts: JSON.stringify(['agriculture', 'ten thousand years ago', 'hunting-gathering to farming', 'Fertile Crescent', 'wheat and barley', 'rice agriculture', 'Mesoamerica maize', 'permanent settlements', 'surplus food', 'animal domestication'])
  },
  {
    id: 'b1-18',
    level: 'B1',
    title: 'Deep Sea Creatures',
    content: 'The deep sea is one of Earth most extreme environments and least explored regions. Deep sea creatures live in complete darkness under tremendous pressure. Many deep sea organisms have adapted remarkable features for survival. Bioluminescence, the ability to produce light, is common among deep sea creatures. Anglerfish use luminescent lures to attract prey in the darkness. Giant squid can grow to enormous sizes and have huge eyes. Bizarre fish with adaptations like transparent heads and large mouths are found only in deep water. Deep sea creatures often have slow metabolic rates and infrequent feeding patterns. Recent technological advances have allowed scientists to explore the deep sea more thoroughly. Studying deep sea life reveals how organisms adapt to extreme conditions.',
    key_concepts: JSON.stringify(['deep sea creatures', 'complete darkness', 'tremendous pressure', 'bioluminescence', 'produce light', 'anglerfish lures', 'giant squid', 'transparent heads', 'slow metabolic rates'])
  },
  {
    id: 'b1-19',
    level: 'B1',
    title: 'The Printing Press Revolution',
    content: 'The invention of the printing press by Johannes Gutenberg in the fifteenth century revolutionized information distribution. Before the printing press, books were copied by hand, a time-consuming and expensive process. The printing press used movable type, allowing pages to be printed quickly and efficiently. Suddenly, books became more affordable and accessible to ordinary people. The spread of printing technology accelerated the distribution of knowledge and ideas. Scientific knowledge could be shared across distances and preserved for future generations. The Protestant Reformation, beginning in the sixteenth century, was greatly facilitated by the printing press. Martin Luther writings were quickly reproduced and distributed throughout Europe. The printing press contributed to the development of standardized spelling and grammar.',
    key_concepts: JSON.stringify(['printing press', 'Johannes Gutenberg', 'fifteenth century', 'copied by hand', 'movable type', 'affordable books', 'Protestant Reformation', 'Martin Luther', 'standardized spelling'])
  },
  {
    id: 'b1-20',
    level: 'B1',
    title: 'Tropical Rainforests',
    content: 'Tropical rainforests are among the most biodiverse ecosystems on Earth. These forests are characterized by high rainfall, warm temperatures, and dense vegetation. Rainforests are found near the equator in regions including South America, Africa, and Southeast Asia. Despite covering only about six percent of Earth surface, rainforests contain roughly half of all plant and animal species. The Amazon rainforest is the largest tropical rainforest and plays a crucial role in global climate regulation. Rainforests produce oxygen and absorb carbon dioxide, helping stabilize Earth atmosphere. Indigenous peoples have lived sustainably in rainforests for thousands of years. However, rainforests face severe threats from deforestation and logging. Agricultural expansion and urban development are primary causes of rainforest destruction.',
    key_concepts: JSON.stringify(['tropical rainforests', 'biodiverse ecosystems', 'equator', 'six percent Earth surface', 'half of plant and animal species', 'Amazon rainforest', 'climate regulation', 'absorb carbon dioxide', 'deforestation and logging'])
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // LEVEL B2 - ADVANCED (20 Articles)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'b2-01',
    level: 'B2',
    title: 'Quantum Entanglement',
    content: 'Quantum entanglement is a complex physical phenomenon that occurs when pairs or groups of particles interact in ways such that the quantum state of each particle cannot be described independently of the state of the others, even when the particles are separated by a large distance. Instead, a quantum state must be described for the system as a whole. Measurements of physical properties such as position, momentum, spin, and polarization performed on entangled particles are found to be perfectly correlated. For example, if one particle is observed to have a spin pointing upward, the spin of its entangled partner will immediately be observed pointing downward, regardless of the distance separating them. This phenomenon puzzled Albert Einstein, who famously referred to it as spooky action at a distance. Today, entanglement is a primary focus of quantum information theory.',
    key_concepts: JSON.stringify(['quantum entanglement', 'quantum state', 'separated by large distance', 'system as a whole', 'position momentum spin', 'polarization', 'perfectly correlated', 'Albert Einstein', 'spooky action at a distance', 'quantum information theory'])
  },
  {
    id: 'b2-02',
    level: 'B2',
    title: 'Linguistic Relativity and Cognition',
    content: 'The Sapir-Whorf hypothesis suggests that the language we speak influences or determines how we perceive and conceptualize the world. This principle, known as linguistic relativity, proposes that speakers of different languages think differently because their languages contain different grammatical structures and vocabularies. Research in cognitive linguistics has provided evidence supporting certain aspects of this hypothesis while challenging others. Some studies demonstrate that languages without specific color terms show differences in color perception compared to speakers of languages with numerous color terms. The concept of linguistic relativity has profound implications for understanding human cognition and cross-cultural communication. Different languages encode information differently, emphasizing certain distinctions while downplaying others. For instance, some languages distinguish grammatically between animate and inanimate objects while others do not. Critics argue that while language may influence thought, it does not determine it entirely.',
    key_concepts: JSON.stringify(['Sapir-Whorf hypothesis', 'linguistic relativity', 'grammatical structures and vocabularies', 'cognitive linguistics', 'color perception', 'human cognition', 'cross-cultural communication', 'animate and inanimate', 'language influences thought'])
  },
  {
    id: 'b2-03',
    level: 'B2',
    title: 'Evolutionary Adaptive Radiation',
    content: 'Adaptive radiation is an evolutionary process whereby organisms diversify rapidly from a common ancestor into a variety of distinct forms adapted to specific ecological niches. This phenomenon has produced some of the most remarkable examples of biodiversity on Earth. The classic example of adaptive radiation is Darwin finches of the Galápagos Islands. When finches arrived on different islands with different food sources, natural selection favored different beak shapes and sizes. Over generations, populations diverged into multiple species with distinct ecological roles and morphological characteristics. Another famous example is the cichlid fishes in African lakes, where hundreds of species evolved from common ancestors in isolated lake systems. The Hawaiian honeycreepers represent another striking case of adaptive radiation, with numerous species evolving distinct plumage patterns and feeding strategies. Adaptive radiation typically occurs in isolated environments.',
    key_concepts: JSON.stringify(['adaptive radiation', 'evolutionary process', 'common ancestor', 'ecological niches', 'Darwin finches', 'Galápagos Islands', 'natural selection', 'beak shapes and sizes', 'cichlid fishes', 'Hawaiian honeycreepers'])
  },
  {
    id: 'b2-04',
    level: 'B2',
    title: 'Neuroplasticity and Learning',
    content: 'Neuroplasticity refers to the brain capacity to reorganize itself by forming new neural connections and pathways throughout life. This fundamental property of the nervous system contradicts the earlier belief that the brain structure remained relatively fixed after early childhood. Modern neuroscience has demonstrated that neuroplasticity operates at multiple levels, from individual synapse strengthening to large-scale cortical reorganization. Learning involves the encoding of new information through synaptic strengthening, a process called long-term potentiation. Conversely, unused neural pathways may weaken through long-term depression. Environmental enrichment, including novel experiences and challenging tasks, promotes neuroplasticity and can enhance cognitive function. Motor learning, such as acquiring new physical skills, involves motor cortex reorganization as practicing individuals develop neural representations of new movements. Neuroplasticity continues throughout life, although the capacity for plastic changes may vary across the lifespan.',
    key_concepts: JSON.stringify(['neuroplasticity', 'neural connections and pathways', 'synapse strengthening', 'cortical reorganization', 'long-term potentiation', 'long-term depression', 'environmental enrichment', 'motor cortex', 'lifespan'])
  },
  {
    id: 'b2-05',
    level: 'B2',
    title: 'Climate System Dynamics',
    content: 'The Earth climate system is a complex, interconnected network of physical, chemical, and biological processes operating at multiple temporal and spatial scales. Solar radiation drives the climate system, providing energy that is unevenly distributed across latitudes and continents. The atmosphere, hydrosphere, lithosphere, and biosphere interact through biogeochemical cycles including the carbon, nitrogen, and water cycles. Greenhouse gases, particularly carbon dioxide, methane, and nitrous oxide, trap outgoing thermal radiation in the atmosphere, creating the greenhouse effect. The equilibrium between incoming solar radiation and outgoing thermal radiation determines the planetary energy balance and average global temperature. Ocean circulation patterns, including thermohaline circulation, transport heat across the globe and influence regional climates. The atmosphere circulates through large-scale convection cells including the Hadley, Ferrel, and Polar cells. Feedback mechanisms, both positive and negative, amplify or dampen climate forcing.',
    key_concepts: JSON.stringify(['climate system', 'solar radiation', 'biogeochemical cycles', 'greenhouse gases', 'carbon dioxide methane nitrous oxide', 'greenhouse effect', 'planetary energy balance', 'thermohaline circulation', 'Hadley Ferrel Polar cells', 'feedback mechanisms'])
  },
  {
    id: 'b2-06',
    level: 'B2',
    title: 'Postmodern Philosophy and Reality',
    content: 'Postmodernism represents a broad intellectual movement characterized by skepticism toward grand narratives, objective truth, and the foundational assumptions of modernism. Postmodern philosophers argue that knowledge is socially constructed and that meaning is inherently unstable and dependent on context. Jean-Paul Sartre existentialist philosophy emphasizes individual freedom and responsibility in creating meaning in an indifferent universe. Michel Foucault explored how discourse and power relationships shape knowledge and social structures. Jacques Derrida developed deconstruction, a method for analyzing how texts undermine their own internal logic and philosophical foundations. Postmodern perspectives challenge the notion that scientific knowledge represents objective reality, arguing instead that science is a social and cultural practice. The postmodern critique has influenced diverse fields including philosophy, literature, architecture, and cultural studies. Critics contend that postmodernism leads to relativism and undermines the possibility of meaningful knowledge.',
    key_concepts: JSON.stringify(['postmodernism', 'skepticism toward grand narratives', 'knowledge socially constructed', 'Jean-Paul Sartre', 'existentialism', 'Michel Foucault', 'power relationships', 'Jacques Derrida', 'deconstruction', 'relativism'])
  },
  {
    id: 'b2-07',
    level: 'B2',
    title: 'Epigenetics and Gene Expression',
    content: 'Epigenetics is the study of heritable changes in gene expression that do not involve alterations to the underlying DNA sequence itself. Epigenetic mechanisms include DNA methylation, histone modification, and chromatin remodeling, which regulate whether genes are transcribed into proteins. DNA methylation involves the addition of methyl groups to cytosine bases, typically resulting in gene silencing. Histone proteins around which DNA wraps influence accessibility of genes to transcription machinery. Chromatin can exist in tightly packed heterochromatin, which is generally transcriptionally inactive, or loosely packed euchromatin, which is transcriptionally active. Epigenetic modifications respond to environmental factors including diet, stress, toxins, and social experiences. These environmental influences can alter epigenetic patterns and thereby change gene expression without modifying DNA sequences. Epigenetic changes can be heritable, potentially affecting offspring and subsequent generations. Dysregulation of epigenetic processes contributes to cancer and developmental disorders.',
    key_concepts: JSON.stringify(['epigenetics', 'heritable changes', 'DNA sequence unaltered', 'DNA methylation', 'histone modification', 'chromatin remodeling', 'gene silencing', 'heterochromatin and euchromatin', 'environmental factors', 'heritable'])
  },
  {
    id: 'b2-08',
    level: 'B2',
    title: 'Phenomenology and Consciousness',
    content: 'Phenomenology is a philosophical method and tradition concerned with the systematic study of consciousness and subjective experience. Edmund Husserl founded phenomenology as a rigorous science of consciousness, emphasizing the importance of subjective perspective. Phenomenologists distinguish between noema, the object of conscious experience, and noesis, the conscious experience itself. Intentionality, the directedness of consciousness toward an object, is fundamental to phenomenological analysis. Maurice Merleau-Ponty explored the embodied nature of consciousness, arguing that consciousness is always mediated through bodily interaction with the world. The phenomenological concept of the lifeworld refers to the prereflective world of lived experience prior to scientific abstraction. Phenomenologists employ the method of bracketing or epoché, temporarily suspending belief in the external world to focus on the structure of consciousness. Phenomenological insights have influenced existentialism, psychology, cognitive science, and studies of artificial consciousness.',
    key_concepts: JSON.stringify(['phenomenology', 'consciousness', 'subjective experience', 'Edmund Husserl', 'noema and noesis', 'intentionality', 'Maurice Merleau-Ponty', 'embodied consciousness', 'lifeworld', 'bracketing or epoche'])
  },
  {
    id: 'b2-09',
    level: 'B2',
    title: 'Protein Folding and Structure',
    content: 'Protein folding is the process whereby a polypeptide chain assumes its three-dimensional structure, critical for biological function. The primary structure of a protein is its amino acid sequence, determined by the DNA template. Secondary structures including alpha helices and beta sheets form through hydrogen bonding between backbone atoms. Tertiary structure refers to the overall three-dimensional folding of the polypeptide, stabilized by interactions between amino acid side chains. Quaternary structure describes associations between multiple polypeptide chains in multi-subunit proteins. Chaperone proteins assist in correct folding and prevent aggregation of partially folded proteins. Misfolded proteins can accumulate and form pathological aggregates implicated in neurodegenerative diseases including Alzheimer and Parkinson disease. The thermodynamic hypothesis suggests proteins fold to minimize free energy, reaching the most stable conformation. However, kinetic factors and chaperone assistance are necessary for proteins to reach their functional conformations.',
    key_concepts: JSON.stringify(['protein folding', 'polypeptide chain', 'three-dimensional structure', 'primary amino acid sequence', 'alpha helices and beta sheets', 'tertiary structure', 'quaternary structure', 'chaperone proteins', 'neurodegenerative diseases', 'thermodynamic hypothesis'])
  },
  {
    id: 'b2-10',
    level: 'B2',
    title: 'International Relations Theory',
    content: 'International relations theory provides frameworks for understanding interactions between states and other actors in the global system. Realism emphasizes that states are the primary actors motivated by national interest and power maximization in an anarchic international system. Liberalism proposes that international cooperation and democratic governance can promote peace and prosperity. Constructivism argues that state interests are socially constructed through interaction and that ideas shape state behavior. Institutionalism examines how international organizations and regimes facilitate cooperation and constrain state behavior. Marxist approaches emphasize class conflict and economic exploitation as fundamental drivers of international relations. Postcolonial theory critiques how dominant powers have structured the international system and calls for redistributing power. Feminist approaches highlight how gender and masculinity shape state behavior and international conflict. The balance of power concept describes how multipolar systems maintain stability through equilibrium.',
    key_concepts: JSON.stringify(['international relations theory', 'realism', 'national interest', 'anarchic system', 'liberalism', 'constructivism', 'institutionalism', 'Marxist approaches', 'balance of power', 'equilibrium'])
  },
  {
    id: 'b2-11',
    level: 'B2',
    title: 'Semiotics and Meaning-Making',
    content: 'Semiotics is the study of signs, symbols, and the processes by which meaning is created and communicated. Charles Peirce proposed that a sign consists of three components: the representamen, the object it refers to, and the interpretant, the meaning produced. Ferdinand de Saussure distinguished between the signifier, the form of the sign, and the signified, the concept it represents. Icons resemble their objects, indices are causally connected to their objects, and symbols have arbitrary relationships with their objects. Semiotics reveals that meaning is not inherent in signs but is constructed through cultural conventions and interpretive practices. Denotation refers to the literal meaning of a sign, while connotation refers to associations and emotions evoked by the sign. Semotic analysis has been applied to literary texts, visual media, advertising, and cultural practices. Roland Barthes explored how ideology is embedded in cultural signs.',
    key_concepts: JSON.stringify(['semiotics', 'signs and symbols', 'Charles Peirce', 'representamen object interpretant', 'Ferdinand de Saussure', 'signifier and signified', 'icons indices symbols', 'denotation and connotation', 'Roland Barthes'])
  },
  {
    id: 'b2-12',
    level: 'B2',
    title: 'Molecular Genetics and Heredity',
    content: 'Molecular genetics elucidates the mechanisms whereby genetic information is stored, replicated, and expressed at the molecular level. DNA, the deoxyribonucleic acid molecule, serves as the repository of genetic information in the form of sequences of nucleotide bases. The Watson-Crick model reveals DNA as a double helix with complementary base pairing between adenine and thymine, and between guanine and cytosine. DNA replication proceeds semiconservatively, with each strand of the parental double helix serving as a template for synthesis of a new complementary strand. Transcription is the process whereby DNA is transcribed into messenger RNA, which carries genetic information from the nucleus to the cytoplasm. Translation is the process whereby mRNA is translated into protein through the mediation of transfer RNA and ribosomal machinery. Mutations represent changes in DNA sequence that can result from replication errors.',
    key_concepts: JSON.stringify(['molecular genetics', 'DNA repository', 'nucleotide bases', 'Watson-Crick model', 'double helix', 'adenine thymine guanine cytosine', 'semiconservative replication', 'transcription mRNA', 'translation tRNA ribosomal', 'mutations'])
  },
  {
    id: 'b2-13',
    level: 'B2',
    title: 'Aesthetics and Artistic Value',
    content: 'Aesthetics is the branch of philosophy concerned with the nature of beauty, artistic value, and aesthetic experience. Aestheticians have long debated what distinguishes aesthetic properties from non-aesthetic properties. Kant proposed that aesthetic judgments are subjective yet universal, arising from a disinterested contemplation of form. Hume argued that while beauty is not objective, some taste in art can be refined through experience and education. The aesthetic formalist view holds that artistic value derives entirely from formal properties of the artwork itself. In contrast, contextualists argue that meaning and value depend on the artworks historical, social, and cultural context. Institutional theory proposes that something becomes art when appropriately presented within the artworld system. Postmodern aesthetics challenges traditional assumptions about artistic genius and aesthetic purity. Contemporary aesthetics increasingly recognizes that aesthetic categories are culturally constructed.',
    key_concepts: JSON.stringify(['aesthetics', 'beauty and artistic value', 'Kant', 'disinterested contemplation', 'Hume taste in art', 'formalism', 'contextualists', 'institutional theory', 'artworld system', 'culturally constructed'])
  },
  {
    id: 'b2-14',
    level: 'B2',
    title: 'Neurotransmission and Synaptic Plasticity',
    content: 'Neurotransmission is the process whereby neurons communicate across synapses through the release and reception of chemical messengers called neurotransmitters. The presynaptic neuron releases neurotransmitters into the synaptic cleft, where they bind to receptors on the postsynaptic membrane. Ionotropic receptors are ligand-gated ion channels that directly open ion channels upon neurotransmitter binding. Metabotropic receptors activate intracellular signaling cascades through G proteins, producing longer-lasting and more complex effects. Synaptic plasticity refers to the ability of synapses to change in strength over time. Long-term potentiation involves persistent strengthening of synapses following high-frequency stimulation. Long-term depression involves persistent weakening of synapses. These mechanisms are believed to underlie learning and memory formation. Synaptic pruning during development eliminates unnecessary synapses. Neurochemical imbalances involving neurotransmitters contribute to psychiatric disorders.',
    key_concepts: JSON.stringify(['neurotransmission', 'synapses', 'neurotransmitters', 'synaptic cleft', 'ionotropic receptors', 'metabotropic receptors', 'synaptic plasticity', 'long-term potentiation', 'long-term depression', 'synaptic pruning'])
  },
  {
    id: 'b2-15',
    level: 'B2',
    title: 'Thermodynamics and Entropy',
    content: 'Thermodynamics is the study of heat, energy, and entropy in physical systems. The first law of thermodynamics states that energy cannot be created or destroyed, only converted between forms. Internal energy of a system comprises kinetic and potential energy of its constituents. Heat and work are mechanisms for transferring energy between systems. The second law of thermodynamics states that entropy, a measure of disorder or uncertainty, increases in isolated systems. This explains the directionality of physical processes and why perpetual motion machines are impossible. Gibbs free energy combines enthalpy and entropy to predict spontaneity of chemical reactions. Entropy increase is associated with irreversible processes and the arrow of time. The third law of thermodynamics states that entropy approaches a minimum value as temperature approaches absolute zero.',
    key_concepts: JSON.stringify(['thermodynamics', 'first law of thermodynamics', 'energy converted', 'internal energy', 'second law of thermodynamics', 'entropy disorder', 'isolated systems', 'perpetual motion impossible', 'Gibbs free energy', 'absolute zero'])
  },
  {
    id: 'b2-16',
    level: 'B2',
    title: 'Ecosystem Services and Valuation',
    content: 'Ecosystem services are the benefits that human populations derive from ecosystems, encompassing supporting, regulating, provisioning, and cultural services. Provisioning services include the production of food, water, and other materials essential for human wellbeing. Regulating services include climate regulation, water purification, and disease control. Supporting services include nutrient cycling and soil formation necessary for ecosystem function. Cultural services include recreational, educational, and spiritual value. Economic valuation of ecosystem services has attempted to quantify their worth in monetary terms to inform policy decisions. The total economic value of ecosystem services often exceeds the value of converting ecosystems for alternative uses. However, not all ecosystem services can be meaningfully monetized, raising ethical questions about commodifying nature. Ecosystem service valuation must account for non-market values including existence value and bequest value. Biodiversity provides insurance value by maintaining ecosystem resilience.',
    key_concepts: JSON.stringify(['ecosystem services', 'provisioning services', 'regulating services', 'supporting services', 'cultural services', 'economic valuation', 'monetary terms', 'commodifying nature', 'non-market values', 'ecosystem resilience'])
  },
  {
    id: 'b2-17',
    level: 'B2',
    title: 'Cognitive Biases and Heuristics',
    content: 'Cognitive biases are systematic patterns in how people deviate from purely rational decision-making. Heuristics are mental shortcuts that generally produce correct conclusions but can lead to predictable errors. The availability heuristic leads people to overestimate probabilities of events that easily come to mind. Confirmation bias causes people to seek information that confirms preexisting beliefs while avoiding disconfirming evidence. The representativeness heuristic leads to probabilistic misjudgments when assessing how similar something is to a category. Anchoring bias causes initial information to disproportionately influence final judgments. Sunk cost fallacy leads people to continue investing in failing projects because of prior investments. Status quo bias causes preference for the current state of affairs even when change would be beneficial. Ingroup bias leads to more favorable evaluation of ingroup members compared to outgroup members.',
    key_concepts: JSON.stringify(['cognitive biases', 'heuristics mental shortcuts', 'availability heuristic', 'confirmation bias', 'representativeness heuristic', 'anchoring bias', 'sunk cost fallacy', 'status quo bias', 'ingroup bias'])
  },
  {
    id: 'b2-18',
    level: 'B2',
    title: 'Plate Tectonics and Geological Processes',
    content: 'Plate tectonics provides a unifying theory explaining the large-scale structure and dynamics of Earth lithosphere. The lithosphere is divided into tectonic plates that move across the asthenosphere. Divergent plate boundaries occur where plates separate, creating seafloor spreading and volcanic activity. Convergent plate boundaries occur where plates collide, producing subduction zones and continental collisions. Transform plate boundaries occur where plates slide past each other horizontally. Seafloor spreading at mid-ocean ridges generates new oceanic crust while old crust is recycled into the mantle at subduction zones. The Wilson cycle describes the opening and closing of ocean basins over geological time. Mantle plumes can initiate continental rifting and produce hotspot volcanic chains. Plate tectonics explains the distribution of earthquakes, volcanoes, and mountain ranges across the globe. Continental drift has occurred throughout Earth history, reorganizing positions of continents multiple times.',
    key_concepts: JSON.stringify(['plate tectonics', 'lithosphere', 'asthenosphere', 'divergent boundaries', 'convergent boundaries', 'transform boundaries', 'seafloor spreading', 'subduction zones', 'Wilson cycle', 'continental drift'])
  },
  {
    id: 'b2-19',
    level: 'B2',
    title: 'Information Theory and Entropy',
    content: 'Information theory, founded by Claude Shannon, provides a mathematical framework for quantifying information and analyzing communication systems. Shannon entropy measures the average information content of a message or random variable. High entropy occurs when message outcomes are unpredictable, while low entropy occurs for predictable messages. Channel capacity determines the maximum rate at which information can be reliably transmitted over a noisy communication channel. The Noisy Channel Coding Theorem establishes theoretical limits for reliable communication. Redundancy in languages provides error tolerance but reduces efficiency. Compression algorithms exploit redundancy to reduce file sizes. Huffman coding assigns shorter bit sequences to more frequent symbols. Cryptography relies on information-theoretic principles to ensure secure communication. Mutual information quantifies the information contained in one variable about another variable. Information theory has applications in telecommunications, data compression, and cryptography.',
    key_concepts: JSON.stringify(['information theory', 'Claude Shannon', 'Shannon entropy', 'unpredictable outcomes', 'channel capacity', 'Noisy Channel Coding Theorem', 'redundancy', 'compression algorithms', 'Huffman coding', 'cryptography'])
  },
  {
    id: 'b2-20',
    level: 'B2',
    title: 'Metacognition and Self-Awareness',
    content: 'Metacognition refers to the capacity to monitor and regulate one own cognitive processes, essentially thinking about thinking. Metacognitive awareness involves conscious reflection on one own knowledge, beliefs, and understanding. Metacognitive monitoring involves assessing the accuracy and adequacy of comprehension. Metacognitive control involves using awareness to adjust cognitive strategies and learning approaches. Dunning-Kruger effect demonstrates that low-ability individuals often overestimate their competence due to deficient metacognition. Experts typically demonstrate accurate metacognitive awareness because extensive experience provides feedback on accuracy. The feeling-of-knowing phenomenon occurs when people anticipate their ability to recall information even when unable to retrieve it currently. Confidence judgments often exceed actual performance, reflecting metacognitive overconfidence. Effective learning depends on accurate metacognitive monitoring to identify knowledge gaps. Students who engage in metacognitive reflection demonstrate improved learning outcomes. Metacognitive training interventions can enhance study strategies.',
    key_concepts: JSON.stringify(['metacognition', 'thinking about thinking', 'metacognitive awareness', 'metacognitive monitoring', 'metacognitive control', 'Dunning-Kruger effect', 'feeling-of-knowing', 'confidence judgments', 'knowledge gaps', 'study strategies'])
  }
];
