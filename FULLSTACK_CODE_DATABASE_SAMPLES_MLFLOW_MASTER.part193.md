---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 193
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 193 of 991)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - mlflow-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/mlflow-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: MLproject]---
Location: mlflow-master/examples/llms/summarization/MLproject

```text
name: llm_summarization

python_env: python_env.yaml

entry_points:
  main:
    command: python summarization.py
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/examples/llms/summarization/python_env.yaml

```yaml
python: "3.10"
build_dependencies:
  - pip
dependencies:
  - langchain>=0.0.244
  - openai>=0.27.2
  - evaluate>=0.4.0
  - mlflow>=2.4.0
  - tiktoken>=0.4.0
```

--------------------------------------------------------------------------------

---[FILE: summarization.py]---
Location: mlflow-master/examples/llms/summarization/summarization.py

```python
import os

import pandas as pd
from langchain.chains import LLMChain
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate

import mlflow

assert "OPENAI_API_KEY" in os.environ, (
    "Please set the OPENAI_API_KEY environment variable to run this example."
)


def build_and_evaluate_model_with_prompt(prompt_template):
    mlflow.start_run()
    mlflow.log_param("prompt_template", prompt_template)
    # Create a news summarization model using prompt engineering with LangChain. Log the model
    # to MLflow Tracking
    llm = OpenAI(temperature=0.9)
    prompt = PromptTemplate(input_variables=["article"], template=prompt_template)
    chain = LLMChain(llm=llm, prompt=prompt)
    logged_model = mlflow.langchain.log_model(chain, name="model")

    # Evaluate the model on a small sample dataset
    sample_data = pd.read_csv("summarization_example_data.csv")
    mlflow.evaluate(
        model=logged_model.model_uri,
        model_type="text-summarization",
        data=sample_data,
        targets="highlights",
    )
    mlflow.end_run()


prompt_template_1 = (
    "Write a summary of the following article that is between triple backticks: ```{article}```"
)
print(f"Building and evaluating model with prompt: '{prompt_template_1}'")
build_and_evaluate_model_with_prompt(prompt_template_1)

prompt_template_2 = (
    "Write a summary of the following article that is between triple backticks. Be concise. Make"
    " sure the summary includes important nouns and dates and keywords in the original text."
    " Just return the summary. Do not include any text other than the summary: ```{article}```"
)
print(f"Building and evaluating model with prompt: '{prompt_template_2}'")
build_and_evaluate_model_with_prompt(prompt_template_2)

# Load the evaluation results
results: pd.DataFrame = mlflow.load_table(
    "eval_results_table.json", extra_columns=["run_id", "params.prompt_template"]
)
results_grouped_by_article = results.sort_values(by="id")
print("Evaluation results:")
print(results_grouped_by_article[["run_id", "params.prompt_template", "article", "outputs"]])

# Score the best model on a new article
new_article = """
Adnan Januzaj swapped the lush turf of Old Trafford for the green baize at Sheffield when he
turned up at the snooker World Championships on Wednesday. The Manchester United winger, who has
endured a frustrating season under Louis van Gaal, had turned out for the Under 21 side at Fulham
on Tuesday night amid reports he could be farmed out on loan next season. But Januzaj may want to
consider trying his hand at another sport after displaying his silky skillls on a mini pool table.
Adnan Januzaj (left) cheered on\xa0Shaun Murphy (right) at the World Championship in Sheffield.
Januzaj shows off his potting skills on a mini pool table at the Crucible on Wednesday.
The 20-year-old Belgium international was at the Crucible to cheer on his friend Shaun Murphy in
his quarter-final against Anthony McGill. The 2005 winner moved a step closer to an elusive second
title in Sheffield with a 13-8 victory, sealed with a 67 break. Three centuries in the match, and
the way he accelerated away from 6-6, showed Murphy is a man to fear, and next for him will be
Neil Robertson or Barry Hawkins. Januzaj turned out for Under 21s in the 4-1 victory at Fulham on
Tuesday night.
"""

print(
    f"Scoring the model with prompt '{prompt_template_2}' on the article '{new_article[:70] + '...'}'"
)
best_model = mlflow.pyfunc.load_model(f"runs:/{mlflow.last_active_run().info.run_id}/model")
summary = best_model.predict({"article": new_article})
print(f"Summary: {summary}")
```

--------------------------------------------------------------------------------

---[FILE: summarization_example_data.csv]---
Location: mlflow-master/examples/llms/summarization/summarization_example_data.csv

```text
id,article,highlights
92c514c913c0bdfe25341af9fd72b29db544099b,"Ever noticed how plane seats appear to be getting smaller and smaller? With increasing numbers of people taking to the skies, some experts are questioning if having such packed out planes is putting passengers at risk. They say that the shrinking space on aeroplanes is not only uncomfortable - it's putting our health and safety in danger. More than squabbling over the arm rest, shrinking space on planes putting our health and safety in danger? This week, a U.S consumer advisory group set up by the Department of Transportation said at a public hearing that while the government is happy to set standards for animals flying on planes, it doesn't stipulate a minimum amount of space for humans. 'In a world where animals have more rights to space and food than humans,' said Charlie Leocha, consumer representative on the committee. 'It is time that the DOT and FAA take a stand for humane treatment of passengers.' But could crowding on planes lead to more serious issues than fighting for space in the overhead lockers, crashing elbows and seat back kicking? Tests conducted by the FAA use planes with a 31 inch pitch, a standard which on some airlines has decreased . Many economy seats on United Airlines have 30 inches of room, while some airlines offer as little as 28 inches . Cynthia Corbertt, a human factors researcher with the Federal Aviation Administration, that it conducts tests on how quickly passengers can leave a plane. But these tests are conducted using planes with 31 inches between each row of seats, a standard which on some airlines has decreased, reported the Detroit News. The distance between two seats from one point on a seat to the same point on the seat behind it is known as the pitch. While most airlines stick to a pitch of 31 inches or above, some fall below this. While United Airlines has 30 inches of space, Gulf Air economy seats have between 29 and 32 inches, Air Asia offers 29 inches and Spirit Airlines offers just 28 inches. British Airways has a seat pitch of 31 inches, while easyJet has 29 inches, Thomson's short haul seat pitch is 28 inches, and Virgin Atlantic's is 30-31.","Experts question if  packed out planes are putting passengers at risk .
U.S consumer advisory group says minimum space must be stipulated .
Safety tests conducted on planes with more leg room than airlines offer ."
caabf9cbdf96eb1410295a673e953d304391bfbb,"Liverpool target Neto is also wanted by PSG and clubs in Spain as Brendan Rodgers faces stiff competition to land the Fiorentina goalkeeper, according to the Brazilian's agent Stefano Castagna. The Reds were linked with a move for the 25-year-old, whose contract expires in June, earlier in the season when Simon Mignolet was dropped from the side. A January move for Neto never materialised but the former Atletico Paranaense keeper looks certain to leave the Florence-based club in the summer. Neto rushes from his goal as Juan Iturbe bears down on him during Fiorentina's clash with Roma in March . Neto is wanted by a number of top European clubs including Liverpool and PSG, according to his agent . It had been reported that Neto had a verbal agreement to join Serie A champions Juventus at the end of the season but his agent has revealed no decision about his future has been made yet. And Castagna claims Neto will have his pick of top European clubs when the transfer window re-opens in the summer, including Brendan Rodgers' side. 'There are many European clubs interested in Neto, such as for example Liverpool and Paris Saint-Germain,' Stefano Castagna is quoted as saying by Gazzetta TV. Firoentina goalkeeper Neto saves at the feet of Tottenham midfielder Nacer Chadli in the Europa League . 'In Spain too there are clubs at the very top level who are tracking him. Real Madrid? We'll see. 'We have not made a definitive decision, but in any case he will not accept another loan move elsewhere.' Neto, who represented Brazil at the London 2012 Olympics but has not featured for the senior side, was warned against joining a club as a No 2 by national coach Dunga. Neto joined Fiorentina from Atletico Paranaense in 2011 and established himself as No1 in the last two seasons.","Fiorentina goalkeeper Neto has been linked with Liverpool and Arsenal .
Neto joined Firoentina from Brazilian outfit Atletico Paranaense in 2011 .
He is also wanted by PSG and Spanish clubs, according to his agent .
CLICK HERE for the latest Liverpool news ."
945232dd73ec679cf682827af3add6c11527cbcf,"For the first time, astronomers have found the building blocks of life  in a distant early star system. Scientists detected the complex organic molecules in a disk of gas and dust around a star 455 light years away where planets are likely to be forming. The discovery is a boost for finding alien organisms and suggests the conditions that spawned life on Earth are not unique to our solar system. Scientists detected the complex organic molecules in a disc of gas around an infant star 455 light years away where planets are likely to be forming. The discovery is a boost for finding alien organisms and suggests the conditions that spawned life on Earth are not unique to our solar system . Radio telescope observations showed the disk surrounding the million-year-old star MWC 480 to be 'brimming' with the complex carbon-based molecule methyl cyanide. Both this molecule and its simpler organic cousin hydrogen cyanide were identified in the cold outer reaches of the newly formed disc. The region can be compared with our solar system's Kuiper Belt, a realm of icy mini-worlds and comets beyond Neptune. Experts believe comets and asteroids from the outer solar system seeded the young Earth with water and organic molecules to set the stage for life to evolve. Astronomers used the Atacama Large Millimetre/submillimetre Array (Alma), a powerful suit of interacting radio telescopes in Chile's Atacama desert, to investigate MWC 480. Alma's high sensitivity antennae have now shown that such molecules not only form and survive, but thrive . Astronomer Dr Karin Oberg, from the Harvard-Smithsonian Centre for Astrophysics in Massachusetts, said: 'Studies of comets and asteroids show that the solar nebula that spawned our sun and planets was rich in water and complex organic compounds. 'I believe we are going to have strong indications of life beyond Earth in the next decade,' said Ellen Stofan, chief scientist for Nasa, (pictured) There at least 200 billion Earth-like planets in our galaxy – and now Nasa officials claim we could be on the verge of finding life on one of them. During a talk in Washington yesterday, the space agency announced that humanity is likely to encounter extra-terrestrials within a decade. 'I believe we are going to have strong indications of life beyond Earth in the next decade and definitive evidence in the next 10 to 20 years,' said Ellen Stofan, chief scientist for Nasa. 'We know where to look, we know how to look, and in most cases we have the technology.' Jeffery Newmark, interim director of heliophysics at the agency, added: 'It's definitely not an if, it's a when.' 'We are not talking about little green men,' Stofan said. 'We are talking about little microbes.' 'We now have evidence that this same chemistry exists elsewhere in the universe, in regions that could form solar systems not unlike our own.' The molecules surrounding MWC 480 have been detected in similar concentrations in our own solar system's comets, she pointed out. The star, which is about twice as massive as the sun, lies in a well-studied star-forming region in the constellation Taurus. Astronomers used the Atacama Large Millimetre/submillimetre Array (Alma), a powerful suit of interacting radio telescopes in Chile's Atacama desert, to investigate MWC 480. Previously it was unclear whether complex organic molecules commonly survive the shocks and radiation levels found in a newly forming solar system . Alma's high sensitivity antennae have now shown that such molecules not only form and survive, but thrive. The findings, reported in the journal Nature, reveal that there is enough methyl cyanide around MWC 480 to fill all of the Earth's oceans. Among complex organic molecules, cyanides - especially methyl cyanide - are important because they contain carbon-nitrogen bonds essential for the formation of amino acids, the components of proteins. As the MWC 480 system evolves it is likely that organic molecules locked away in comets and other icy bodies will be ferried closer to the star where conditions may be suitable for life, the scientists believe. Dr Oberg added: 'From the study of exoplanets, we know our solar system isn't unique in having rocky planets and an abundance of water. 'Now we know we're not unique in organic chemistry. Once more, we have learned that we're not special. From a life in the universe point of view, this is great news.'","Million-year-old star MWC 480 is 'brimming' with carbon-based molecules .
Scientists say there is enough methyl cyanide  to fill all of Earth's oceans.
As MWC 480 evolves it is likely the molecules will move closer to the star .
Here, the conditions may be suitable for life to flourish, scientists believe ."
d2912725c0878dc3d44478f5f70e88efb0988a59,"Marathon season is in full swing with the London Marathon set to take place a week on Sunday. The long distance runners will inspire many to take up running and as the evening gets lighter and the weather gets warmer, it's the perfect time to pull on your trainers and get fit. But what trainers should you go for? Running is often celebrated as a budget sport because you don't have to pay expensive gym fees or buy lots of equipment. But trainers can be costly - proved by the latest adidas Boost shoes that have gone on sale for £130. Femail writer and marathon runner Lucy Waterlow tested out £130 adidas Ultra Boost trainers against Aldi's budget £19.99 pair ahead of the London Marathon next week . In contrast, supermarket chain Aldi have a running flash sale in stores from tomorrow (Thursday) with trainers available for the budget price of £19.99, while stocks last. The shoes you run in are important to prevent injuries and ensure you have a comfortable and enjoyable experience - so can you really get the same results from a cheap supermarket pair over the costly version from a major sports brand? FEMAIL asked Lucy Waterlow, a marathoner with a personal best time of 3.06 and co-writer of Nell McAndrew's Guide To Running, to take them for a test run... THE TRAINERS . Adidas Ultra Boost, £130: Adidas promise to deliver 'your greatest run ever' with their new trainer which features their much-hyped 'Boost' technology. This is a type of cushioning that the sports brand have developed that looks like polystyrene and offers support and comfort to the wearer. Adidas say the Boost cushioning also gives 'energy return' so the wearer can run more effortlessly. The adidas Boost technology is a type of cushioning that they say will deliver 'your greatest run ever' while the Primeknit fabric is said to 'allow the natural expansion of any foot shape' At £130, the shoes only offer value for money if you intend to run in them often but the bumpy undersole doesn't seem to be that durable . It certainly seems to have worked for the numerous elite athletes, including Jessica Ennis, who have worn Boost trainers thanks to sponsorship deals. Wilson Kipsang wore the adidas Adizero Adios version when he ran what was then a World Record time of 2:03:23 in Berlin in 2013. Speaking of the Ultra Boost version, which have been on sale since February at a RRP of £130, adidas executive Eric Liedtke said: 'Ultra BOOST represents the culmination of years of work and meticulous research striving to create the greatest running shoe ever. 'All of the very best in adidas technology has been combined to create a shoe that provides industry leading Energy Return, alongside unprecedented adaptability and comfort.' Aldi Premium Running Shoes, £19.99: The premium running shoes are part of the Aldi's latest 'Specialbuys' running range under the label 'Crane', which will be in stores from 16th April and available while stocks last. It's not the first time Aldi have sold running trainers as a non 'premium' version went on sale for £14.99 in 2013. Aldi's £19.99 premium running shoes for women comes in a turquoise and pink shade . The men's version is royal blue and will only be available in stores while stocks last . Aldi say their running range is 'high spec' despite the low prices, as they keep their costs down by stocking their own products over big brands, having minimalist store interiors to reduce overheads and charging for plastic bags. The supermarket chain aren't in the business of sponsoring elite athletes so can't lay claim to helping Olympians to medals or World Records with their shoes. LUCY'S VERDICT: APPEARANCE . Adidas: The trainers come in black with purple embellishment for both men and women and are made using adidas Primeknit fabric which is said to 'allow the natural expansion of any foot shape.' The dark colour makes a refreshing change for women - who are often only offered running shoes in pink and pastel shades - while the Primeknit fabric does look stylish and professional. The Boost cushioning encompasses the shoe a bit like a hovercraft so they don't make your feet look small and dainty. But while friends I met for a run did observe my feet looked big in the trainers, they also admired the fashionable appearance of the shoe. Aldi: The supermarket's trainers look the part and come in a bright turquoise and pink shade for women and royal blue for men. The appearance is reminiscent of Brooks popular Adrenaline running shoes so friends didn't guess they were made by Aldi until I told them. The Aldi trainers feature reflective material - which is great for being seen when running at night - but the rest of the fabric used does look cheap. The outsole looks bulky and plastic so it doesn't look like it will have much give when running. LUCY'S VERDICT: FIT AND RUNNING FEEL . Adidas: The shoes have a tongue at the back of the heel so they can be pulled on easily and the Primeknit fabric makes it feel you're putting your foot into a comfortable sock. The laces are sleek and elastic so can be easily tied for a snug fit. Adidas shoes can often come up small, so it's advisable to buy a pair half a size larger than your usual shoe size. In doing so, I found my pair to be a perfect fit. My toes had plenty of space at the front so they didn't pinch when my foot pushed forward when I was running, and they weren't too lose at the heel so they didn't rub. Often after trying new running shoes blisters can form but this wasn't the case, even after a nine mile run in the shoes. The Boost cushioning gives a comfortable and springy feel and despite its bulky appearance, the shoes do not feel too heavy on the foot while running. Lucy found the Boost trainers, left, fitted well and felt comfortable on a long run, while the Aldi trainers, right, were adequate but felt bulkier and weren't as snug a fit . Aldi: The shoes are not available in half sizes so I opted for my usual shoe size, despite this they still felt too big. I ran in the same running socks I had worn when running in the adidas trainers but felt I could have used a thicker pair in order for the shoes to fit better. The trainers were not a snug fit so I felt I had too much room around my forefoot and tightening the laces further did not help alleviate the roomy feel. Wearing thicker socks did help but I still felt my feet were sliding around a bit too much. However, they didn't rub so I again didn't suffer from any blisters but they did feel less comfortable and weren't as well fitted as the adidas pair. The trainers also felt heavier on my feet than the Boost. Overall, they felt more sturdy then the adidas pair and I didn't feel like they adapted to my feet in the same way - running in them for a short run was fine but I wouldn't feel comfortable wearing them for a long run or when doing speed work. LUCY'S OVERALL VERDICT . To my surprise, the Aldi shoes on the whole looked and felt the part - although the fit wasn't ideal. I'd recommend these to runners on a budget who are just starting out, who may just be running two or three times a week and aren't sure yet if they'll stick with it. At £19.99, if you don't carry on running if your motivation wanes, you won't be too much out of pocket. The supportiveness of the shoes also means they would be suitable to wear at the gym or for walking. However, if you intend to carry on running, I'd recommend going to a specialist running shop to be fitted for a shoe exactly to your foot type. They can analyse your running style to see if you need any extra support. The adidas shoes felt comfortable and I was happy running in them for miles. Although they feel a little too bulky for speedwork, they're great for steady runs and I would run a marathon in them. I'm not convinced this Ultra Boost model is worth the £130 price tag though - unless you can run in them often to get value for money. I'm also not convinced that the unusual bumpy undersole they have will be that durable - after just a few runs the rubber has shown signs of wear. What I convinced by was the cushioning provided by the Boost technology. But in the future I would be more likely to buy the Adizero Adios version for speedwork and racing as they are lighter in weight and not as expensive as their Ultra counterparts.","Running is often celebrated as a cheap sport to take up .
But it's important to get right trainers to avoid injury and feel comfortable .
Adidas latest Ultra Boost on sale for pricey £130 .
Budget supermarket Aldi have a pair for £19.99 .
So can our runner tell the difference?"
ed8674cc15b29a87d8df8de1efee353d71122272,"Our young Earth may have collided with a body similar to the planet Mercury, says a new paper. The dramatic event could explain why our planet has a hot core that gives it its magnetic field. And it could also explain why certain rare-earth elements in Earth's mantle do not seem to originate from the planet's other building blocks - meteorites. Oxford scientists say a Mercury-like body struck the young Earth (artist's illustration shown). The object would have been the heat source for our planet's core. The same object could have been responsible for creating the moon. It also explains where some rare-Earth elements came from . The study, by two scientists from the University of Oxford, was published in the journal Nature. Our current theory of Earth's formation involves basically more and more asteroids and other objects accumulating into one body. However, this model cannot explain where the heat source for Earth's core - and ultimately its magnetic field - came from. In addition, Earth's crust and mantle appear to have a higher ratio of the rare-earth elements samarium and neodymium than most meteorites - suggesting there was more at play in Earth's formation than first thought. To address this discrepancy, scientists believe that Earth was hit by a body that was the size of Mars - but like Mercury in its composition - early in its life. This likely would have happened about 4.5 billion years ago. The body would have been rich in sulphur but very poor in oxygen - just like Mercury. Many researchers believe the moon formed after Earth was hit by a planet the size of Mars billions of years ago. This is called the giant impact hypothesis. The hypothesis claims the moon is debris left over following an indirect collision between our planet and an astronomical body approximately 4.5 billion years ago. The colliding body is sometimes called Theia, after the mythical Greek Titan who was the mother of Selene, the goddess of the Moon. But one mystery has persisted, revealed by rocks the Apollo astronauts brought back from the moon - why are the moon and Earth so similar in their composition? Several different theories have emerged over the years to explain the similar fingerprints of Earth and the moon. Perhaps the impact created a huge cloud of debris that mixed thoroughly with the Earth and then later condensed to form the moon. Or Theia could have, coincidentally, been isotopically similar to young Earth. A third possibility is that the moon formed from Earthen materials, rather than from Theia, although this would have been a very unusual type of impact. Our current theory of Earth's (left) formation involves basically more and more asteroids and other objects accumulating into one body. Now scientists think that Earth was hit by a body that was the size of Mars, but like Mercury (right) in its composition, early in its life. In the young solar system 4.5 billion years ago, illustrated, various planetesimals and other small bodies coalesced together to form larger bodies like Earth . As it collided with Earth, it would have produced radioactive uranium and thorium, generating the heat needed to drive the 'dynamo' of molten iron in Earth's core. And they do not rule out the possibility that this is the same Mars-sized body that formed the moon. 'We think that that is quite conceivable,' said study co-author Bernard Wood, reported the LA Times. 'It's kind of exciting to think that this reduced body could actually be the thing which caused the moon.' In an accompanying News and Views article for Nature, Dr Richard Carlson of the Carnegie Institution for Science in Washington, DC said the theory could open up new avenues for thought.. For example, if true, it would raise further questions about 'how Earth ended up in its present oxidised state, which it has apparently retained for more than three billion years.'","Oxford scientists say a Mercury-like body struck the young Earth .
The Mars-sized object would have been the heat source for our planet .
The same object could have been responsible for creating the moon .
It also explains where some rare-Earth elements came from ."
```

--------------------------------------------------------------------------------

---[FILE: tracing.py]---
Location: mlflow-master/examples/mistral/tracing.py

```python
"""
This is an example for leveraging MLflow's auto tracing capabilities for Mistral AI.

For more information about MLflow Tracing, see: https://mlflow.org/docs/latest/llms/tracing/index.html
"""

import os

from mistralai import Mistral

import mlflow

# Turn on auto tracing for Mistral AI by calling mlflow.mistral.autolog()
mlflow.mistral.autolog()

# Configure your API key.
client = Mistral(api_key=os.environ["MISTRAL_API_KEY"])

# Use the chat complete method to create new chat.
chat_response = client.chat.complete(
    model="mistral-small-latest",
    messages=[
        {
            "role": "user",
            "content": "Who is the best French painter? Answer in one short sentence.",
        },
    ],
)
print(chat_response.choices[0].message)
```

--------------------------------------------------------------------------------

---[FILE: evaluate_example.py]---
Location: mlflow-master/examples/mlflow-3/evaluate_example.py

```python
from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

import mlflow
from mlflow.models import infer_signature

X, y = load_iris(return_X_y=True, as_frame=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=42)
X_test_1, X_test_2, y_test_1, y_test_2 = train_test_split(
    X_test, y_test, test_size=0.5, random_state=42
)
model = LogisticRegression().fit(X_train, y_train)

predictions = model.predict(X_train)
signature = infer_signature(X_train, predictions)

with mlflow.start_run() as run:
    model_info = mlflow.sklearn.log_model(model, name="model", signature=signature)
    print(model_info.name)

    # Evaluate the model URI
    mlflow.evaluate(
        model_info.model_uri,
        X_test_1.assign(label=y_test_1),
        targets="label",
        model_type="classifier",
        evaluators=["default"],
    )
    print(mlflow.get_logged_model(model_info.model_id))

    # Evaluate the pyfunc model object
    model = mlflow.pyfunc.load_model(model_info.model_uri)
    assert model.model_id is not None
    mlflow.evaluate(
        model,
        X_test_2.assign(label=y_test_2),
        targets="label",
        model_type="classifier",
        evaluators=["default"],
    )
    print(mlflow.get_logged_model(model_info.model_id))
```

--------------------------------------------------------------------------------

---[FILE: langchain_databricks_example.py]---
Location: mlflow-master/examples/mlflow-3/langchain_databricks_example.py

```python
"""
python examples/mlflow-3/langchain_databricks_example.py
"""

from databricks.sdk import WorkspaceClient
from langchain_core.runnables import RunnableLambda

import mlflow

mlflow.langchain.autolog(log_models=True)

wc = WorkspaceClient()
mlflow.set_tracking_uri("databricks")
mlflow.set_experiment(f"/Users/{wc.current_user.me().user_name}/langchain-autolog")

with mlflow.start_run() as run:
    r = RunnableLambda(lambda x: x + 1)
    r.invoke(3)

print(mlflow.search_traces(max_results=1))
```

--------------------------------------------------------------------------------

---[FILE: langchain_example.py]---
Location: mlflow-master/examples/mlflow-3/langchain_example.py

```python
from langchain_community.chat_models import ChatDatabricks
from langchain_core.prompts import ChatPromptTemplate

import mlflow

# Define the chain
chat_model = ChatDatabricks(
    endpoint="databricks-llama-2-70b-chat",
    temperature=0.1,
    max_tokens=2000,
)
prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a chatbot that can answer questions about Databricks.",
        ),
        ("user", "{question}"),
    ]
)

chain = prompt | chat_model

# Log the chain with MLflow
model = mlflow.langchain.log_model(
    lc_model=chain,
    name="basic_chain",
    params={"temperature": 0.1, "max_tokens": 2000, "prompt_template": str(prompt)},
    # Specify the model type as "agent"
    model_type="agent",
)
model_id = model.model_id
print("\n")
print(model)

# Trace the chain.
# Note: All of this boilerplate except for `mlflow.langchain.autolog()` will go away shortly (prototyping in progress)
with mlflow.start_span(model_id=model_id) as span:
    mlflow.langchain.autolog()
    inputs = {"question": "What is Unity Catalog?"}
    span.set_inputs(inputs)

    outputs = chain.invoke(inputs)
    span.set_outputs(outputs)

# Fetch the traces by model ID
print(mlflow.search_traces(model_id=model_id)[["request", "response"]])

import pandas as pd

# Start a run to represent the evaluation job
with mlflow.start_run() as evaluation_run:
    # Load the evaluation dataset with MLflow. We will link evaluation metrics to this dataset.
    eval_dataset: mlflow.data.pandas_dataset.PandasDataset = mlflow.data.from_pandas(
        df=pd.DataFrame.from_dict(
            {
                "question": ["Question1", "Question2", "..."],
                "ground_truth": ["Answer1", "Answer2", "..."],
            }
        ),
        name="eval_dataset",
    )

    def mock_evaluate(chain, dataset):
        return {
            "correctness_score": 0.7,
            "toxicity_detected_binary": 0,
        }

    # TODO: Substitute mlflow.evaluate() into this example
    metrics = mock_evaluate(chain, eval_dataset)
    mlflow.log_metrics(
        metrics=metrics,
        dataset=eval_dataset,
        # Specify the ID of the agent logged above
        model_id=model_id,
    )

model = mlflow.get_logged_model(model_id)
# Feedback: it would be nice if the model linked to *all* evaluation runs, not just the source!

model.metrics

evaluation_run = mlflow.get_run(evaluation_run.info.run_id)
print(evaluation_run)
print("\n")
# Feedback: The dataset should also be an input here
print(evaluation_run.inputs)

import torch
import torch.nn.functional as F
from sklearn.datasets import load_iris
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from torch import nn

import mlflow.pytorch

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

all_X, all_Y = load_iris(as_frame=True, return_X_y=True)
all_X["targets"] = all_Y
train, test = train_test_split(all_X)


def prepare_data(X_y):
    X = train_dataset.df.drop(["targets"], axis=1)
    y = train_dataset.df[["targets"]]

    return torch.FloatTensor(X.to_numpy()).to(device), torch.LongTensor(y.to_numpy().flatten()).to(
        device
    )


def compute_accuracy(model, X, y):
    model.eval()
    with torch.no_grad():
        predict_out = model(X)
        _, predict_y = torch.max(predict_out, 1)

        return float(accuracy_score(y.cpu(), predict_y.cpu()))


class IrisClassifier(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(4, 10)
        self.fc2 = nn.Linear(10, 10)
        self.fc3 = nn.Linear(10, 3)

    def forward(self, x):
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        x = F.dropout(x, 0.2)
        x = self.fc3(x)
        return x


model = IrisClassifier()
model = model.to(device)
scripted_model = torch.jit.script(model)  # scripting the model

# Start a run to represent the training job
with mlflow.start_run():
    # Load the training dataset with MLflow. We will link training metrics to this dataset.
    train_dataset: mlflow.data.pandas_dataset.PandasDataset = mlflow.data.from_pandas(
        train, name="train_dataset"
    )
    X_train, y_train = prepare_data(train_dataset.df)

    # Log training job parameters
    mlflow.log_param("num_gpus", 1)
    mlflow.log_param("optimizer", "adam")

    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(scripted_model.parameters(), lr=0.01)

    for epoch in range(100):
        out = scripted_model(X_train)
        loss = criterion(out, y_train).to(device)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        if epoch % 10 == 0:
            # Log a checkpoint with metrics every 10 epochs
            mlflow.log_metric(
                "accuracy",
                compute_accuracy(scripted_model, X_train, y_train),
                step=epoch,
                dataset=train_dataset,
            )
            mlflow.pytorch.log_model(
                pytorch_model=scripted_model,
                name="torch-iris",
                # "hyperparams=?"
                # Feedback: No need for this, just inherit from the run params!
                params={
                    # Log model parameters
                    "n_layers": 3,
                },
                # Specify the epoch at which the model was logged
                step=epoch,
                # Specify the training dataset with which the metric is associated
                dataset=train_dataset,
                # Feedback: Should support checkpoint TTL, automatically purge checkpoints with lower performance
                # Feedback: Checkpointing for stability (checkpoint every Y mins) vs performance (checkpoint per X epochs + evals)
            )

ranked_checkpoints = mlflow.search_logged_models(
    filter_string="params.n_layers = '3' AND metrics.accuracy > 0",
    order_by=["metrics.accuracy DESC"],
    output_format="list",
)
worst_checkpoint = ranked_checkpoints[-1]
print("WORST CHECKPOINT", worst_checkpoint)

print("\n")

best_checkpoint = ranked_checkpoints[0]
print("BEST CHECKPOINT", best_checkpoint)

# Feedback: Consider renaming `Model` to `Checkpoint`
# perhaps some field on the Model indicating whether its a checkpoint so that we can limit the # of checkpoints
# displayed in the UI by default (e.g. only show the best or most recent ones), automatically TTL the checkpoints,
# would be quite nice

# Start a run to represent the test dataset evaluation job
with mlflow.start_run() as evaluation_run:
    # Load the test dataset with MLflow. We will link test metrics to this dataset.
    test_dataset: mlflow.data.pandas_dataset.PandasDataset = mlflow.data.from_pandas(
        test, name="test_dataset"
    )
    X_test, y_test = prepare_data(test_dataset.df)

    # Load the best checkpoint
    model = mlflow.pytorch.load_model(f"models:/{best_checkpoint.model_id}")
    model = model.to(device)
    scripted_model = torch.jit.script(model)

    # Evaluate the model on the test dataset and log metrics to MLflow
    mlflow.log_metric(
        "accuracy",
        compute_accuracy(scripted_model, X_test, y_test),
        # Specify the ID of the checkpoint to which to link the metrics
        model_id=best_checkpoint.model_id,
        # Specify the test dataset with which the metric is associated
        dataset=test_dataset,
    )

mlflow.get_logged_model(best_checkpoint.model_id)

print([m.to_dictionary() for m in mlflow.get_logged_model(best_checkpoint.model_id).metrics])
```

--------------------------------------------------------------------------------

---[FILE: langchain_simple.py]---
Location: mlflow-master/examples/mlflow-3/langchain_simple.py

```python
import mlflow

mlflow.langchain.autolog(log_models=True)

from langchain_core.runnables import RunnableLambda

with mlflow.start_run() as run:
    r = RunnableLambda(lambda x: x + 1)
    r.invoke(3)

trace = mlflow.search_traces(experiment_ids=[run.info.experiment_id], max_results=1).iloc[0]
assert "mlflow.modelId" in trace["request_metadata"]

models = mlflow.search_logged_models(
    experiment_ids=[run.info.experiment_id],
    output_format="list",
)
loaded_model = mlflow.langchain.load_model(f"models:/{models[0].model_id}")
print(loaded_model.invoke(3))
```

--------------------------------------------------------------------------------

---[FILE: load_model_from_runs_uri.py]---
Location: mlflow-master/examples/mlflow-3/load_model_from_runs_uri.py

```python
from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression

import mlflow
from mlflow.models import infer_signature

X, y = load_iris(return_X_y=True, as_frame=True)
model = LogisticRegression().fit(X, y)
signature = infer_signature(X, model.predict(X))

with mlflow.start_run() as run:
    mlflow.sklearn.log_model(model, name="model", signature=signature)
    runs_uri = f"runs:/{run.info.run_id}/model"
    model = mlflow.sklearn.load_model(runs_uri)
    print(model.predict(X)[:10])
```

--------------------------------------------------------------------------------

---[FILE: proto_inputs_outputs.py]---
Location: mlflow-master/examples/mlflow-3/proto_inputs_outputs.py

```python
import pandas as pd
from sklearn.model_selection import train_test_split

import mlflow
from mlflow.entities import (
    DatasetInput,
    LoggedModelInput,
    LoggedModelOutput,
    LoggedModelStatus,
    Run,
)

client = mlflow.MlflowClient()

# Read the wine-quality csv file from the URL
csv_url = (
    "https://raw.githubusercontent.com/mlflow/mlflow/master/tests/datasets/winequality-red.csv"
)
data = pd.read_csv(csv_url, sep=";")

# Split the data into training and test sets. (0.75, 0.25) split.
X = data.drop(["quality"], axis=1)
y = data[["quality"]]
train_X, test_X, train_y, test_y = train_test_split(X, y)

train_dataset = mlflow.data.from_pandas(train_X.assign(quality=train_y), name="train_dataset")
test_dataset = mlflow.data.from_pandas(test_X.assign(quality=test_y), name="test_dataset")


with mlflow.start_run() as training_run:
    logged_model = client.create_logged_model(training_run.info.experiment_id, name="model")
    client.finalize_logged_model(logged_model.model_id, LoggedModelStatus.READY)

    mlflow.log_input(dataset=test_dataset, model=LoggedModelInput(logged_model.model_id))
    mlflow.log_outputs(models=[LoggedModelOutput(model_id=logged_model.model_id, step=0)])

    # Check that inputs and outputs were logged correctly
    active_run = client.get_run(training_run.info.run_id)
    assert active_run.inputs.dataset_inputs == [DatasetInput(test_dataset._to_mlflow_entity())]
    assert active_run.inputs.model_inputs == [LoggedModelInput(model_id=logged_model.model_id)]
    assert active_run.outputs.model_outputs == [
        LoggedModelOutput(model_id=logged_model.model_id, step=0)
    ]

    # Check that to/from proto conversion works as expected
    assert Run.from_proto(active_run.to_proto()).to_proto() == active_run.to_proto()
```

--------------------------------------------------------------------------------

````
