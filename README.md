# RSLang team task
### Typescript rslang app, educational app for learning english language.

![image](https://user-images.githubusercontent.com/95471509/190917317-3d0f2e6f-505e-410c-a92a-12c5433cc680.png)



## Getting Started

<i>Warning: sometime app can experience lags, because of free online server</i>

### Deploy
https://marcuskordunski.github.io/rslang/dist/

To download the project:
```
git clone https://github.com/MarcusKordunski/rslang.git
```

If you want to start local app server, run next command in `rslang` directory:
```
npm run start
```

## Features
#### Starting page
* Basic info about project, team members and their contribution
#### Authorization
* You can register new user or login with created one, every user has their own progress and statistics.
#### Textbook
![image](https://user-images.githubusercontent.com/95471509/190920339-434e5b50-508a-44f0-9af9-56e357d20f3b.png)

<i>Could take some time to load for the first time</i>
* Current page and group(difficulty) is saving into local storage
* Textbook is linked to games, by gathering true/false counter numbers, and number of rules which specify: when word should become "hard" or "learned"
* If you starting games from textbook page, game will take words from current page and group.
#### Educational game "Audio call"
![image](https://user-images.githubusercontent.com/95471509/190920314-fb193fa4-3f3a-4f2a-a634-d9c76ef2b58b.png)

* You should define word by ear and choose right variant of translation
* Statistic being gathered
* Result screen
* Controlled either by keyboard or mouse
#### Educational game "Sprint"
![image](https://user-images.githubusercontent.com/95471509/190920290-d5425588-04b6-45ca-b628-7218ee204a92.png)

* You should define, is given word translation right
* Statistic being gathered
* Result screen
* Controlled either by keyboard or mouse
#### Statistic page
![image](https://user-images.githubusercontent.com/95471509/190920358-2fb3c59a-5e27-459c-8246-375d4a97aba0.png)

* Statistic being gathered from two games
* Statistic is unavailable if you isn't authorized or didn't play any games yet.
## Built With
* [Typescript](https://www.typescriptlang.org/) - TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
* HTML5 - HTML5 is a markup language used for structuring and presenting content on the World Wide Web.
* CSS3 - Cascading Style Sheets (CSS) is a style sheet language used for describing the presentation of a document written in a markup language such as HTML or XML.
* [ESLint](https://eslint.org/) - ESLint statically analyzes your code to quickly find problems. It is built into most text editors and you can run ESLint as part of your continuous integration pipeline.
* [Webpack](https://webpack.js.org/) - At its core, webpack is a static module bundler for modern JavaScript applications.
## Authors

* **Mihail Samofalov** -
[GitHub](https://github.com/zem41k)

* **Vladimir Strogonov** -
[GitHub](https://github.com/antipachita)

* **Marcus Kordunski** -
[LinkedIn](https://www.linkedin.com/in/marcus-kordunski/) | 
[GitHub](https://github.com/MarcusKordunski)
