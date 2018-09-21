'use strict';

import React from 'react';
import { Link, Router, browserHistory } from 'react-router';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import CategoryUi from './ui/elements/CategoryUi';
import RecipeUi from './ui/elements/RecipeUi';
import db from '../db/db.json';

class IndexPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {layout: 'intro',
                    categoryActive: {},
                    recipeActive: {},
                    search: '', searchRecipes: []};
        this.changeCategory = this.changeCategory.bind(this);
        this.changeRecipe = this.changeRecipe.bind(this);
        this.goBack = this.goBack.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    componentDidMount() {
        //document.addEventListener("backbutton", this.goBack(), false);
    }

    changeCategory(category) {
        this.setState({layout: 'categories', categoryActive: category, search: '', searchRecipes: []});
    }

    changeRecipe(recipe) {
        let category = {};
        for (let i=0; i < db.categories.length; i++) {
            if (db.categories[i].idCategory == recipe.idCategory) category = db.categories[i];
        }
        this.setState({layout: 'recipe', categoryActive: category, recipeActive: recipe, search: '', searchRecipes: []});
    }

    handleSearch(event) {
        var self = this;
        let search = event.target.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        if (search) {
            let categories = {};
            for (let i=0; i < db.categories.length; i++) {
                categories[db.categories[i].idCategory] = db.categories[i].name;
            }
            let searchRecipes = db.recipes.filter(item => item.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").indexOf(search)>=0)
                                            .map((item) => { item.categoryName = categories[item.idCategory]; return item; });
            this.setState({search: search, searchRecipes: searchRecipes});
        } else {
            this.setState({search: '', searchRecipes: []});
        }
    }

    goBack() {
        if (this.state.layout=='recipe') {
            this.setState({layout: 'categories', recipeActive: {}, search: '', searchRecipes: []});
        } else if (this.state.layout=='categories') {
            this.setState({layout: 'intro', recipeActive: {}, categoryActive: {}, search: '', searchRecipes: []});
        }
    }

    render() {
        return (<div className="wrapper">

                    <div className="header">
                        <div className="headerBase">
                            <div className="headerBaseLeft">
                                {this.state.layout!='intro' &&
                                <div className="buttonBack" onClick={() => this.goBack()}>
                                    <i className="icon icon-arrow-left"/>
                                    <span>Volver</span>
                                </div>}
                            </div>
                            <div className="headerBaseRight">
                                <div className="formSearch">
                                    <input type="text" name="search" value={this.state.search} onChange={this.handleSearch} autoComplete="off" ref={(item) => this.searchInput = item}/>
                                    <div className="buttonSearch" onClick={() => {this.searchInput.focus()}}>
                                        <i className="icon icon-search"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {this.state.search &&
                    <div className="searchResults">
                        <div className="searchResultsIns">
                            {this.state.searchRecipes.length==0 &&
                            <div className="searchResultsListEmpty" onClick={() => this.setState({search: ''})}>Lo sentimos, no tenemos resultados para su búsqueda.</div>}
                            {this.state.searchRecipes.length>0 &&
                            <div className="searchResultsList">
                                {this.state.searchRecipes.map((item) => <RecipeUi recipe={item} key={"recipe-" + item.idRecipe} callback={this.changeRecipe} layout="search" search={this.state.search}/>)}
                            </div>}
                        </div>
                    </div>}

                    <div className={"pages " + ((this.state.categoryActive.idCategory) ? 'pages-' + this.state.categoryActive.idCategory : '')}>
                        {this.state.layout=='intro' &&
                        <CSSTransition key="categories" classNames="fade" timeout={500} appear={true} in={(this.state.layout=='intro') ? true : false}>
                            <div className="page page-categories">
                                {this.renderHead('main', db.site.titleGeneric, db.site.titleCountry)}
                                {db.categories.map((item) => <CategoryUi category={item} key={"category-intro-" + item.idCategory} callback={this.changeCategory} layout="intro"/>)}
                            </div>
                        </CSSTransition>}

                        {this.state.layout=='categories' && this.state.categoryActive.idCategory &&
                        <CSSTransition key={"recipes-" + this.state.categoryActive.idCategory} classNames="fade" timeout={500} appear={true} in={(this.state.layout=='categories') ? true : false}>
                            <div className={"page page-recipes page-recipes-" + this.state.categoryActive.idCategory}>
                                {this.renderHead('inside', "Listado de recetas", this.state.categoryActive.name)}
                                {db.recipes.filter(item => item.idCategory==this.state.categoryActive.idCategory)
                                            .map((item) => <RecipeUi recipe={item} key={"recipe-" + item.idRecipe} callback={this.changeRecipe}/>)}
                            </div>
                        </CSSTransition>}

                        {this.state.layout=='recipe' && this.state.recipeActive.idRecipe &&
                        <CSSTransition key={"recipe-" + this.state.recipeActive.idRecipe} classNames="fade" timeout={500} appear={true} in={(this.state.layout=='recipe') ? true : false}>
                            <div className="page page-recipe">
                                <RecipeUi recipe={this.state.recipeActive} layout="complete" callback={this.changeRecipe}/>
                            </div>
                        </CSSTransition>}
                    </div>

                </div>);
    }

    renderHead(type, title, subtitle) {
        return (<div className={"head head-" + type}>
                    <i className="icon icon-chef"/>
                    <div className="headInfo">
                        <div className="headTitle">{title}</div>
                        <div className="headSubtitle">{subtitle}</div>
                    </div>
                </div>);
    }

}

export default IndexPage;
