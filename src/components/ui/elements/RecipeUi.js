'use strict';

import React from 'react';
import Highlighter from "react-highlight-words";
import db from '../../../db/db.json';

class RecipeUi extends React.Component {

    constructor(props) {
        super(props);
        this.state = {recipe: this.props.recipe,
                        layout: this.props.layout};
        this.renderStars = this.renderStars.bind(this);
        this.renderRelated = this.renderRelated.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.layout != this.state.layout) {
            this.setState({layout: nextProps.layout});
        }
        if (nextProps.recipe && nextProps.recipe.idRecipe != this.state.recipe.idRecipe) {
            this.setState({recipe: nextProps.recipe});
        }
        if (nextProps.category && nextProps.category.idCategory != this.state.category.idCategory) {
            this.setState({category: nextProps.category});
        }
    }

    render() {
        const { t } = this.props;
        switch (this.state.layout) {

            default:
                return (<div className="recipe" onClick={() => this.props.callback(this.state.recipe)}>
                            <div className="recipeIns">
                                <div className="recipeInfo">
                                    <div className="recipeInfoName">{this.state.recipe.name}</div>
                                    {this.renderStars()}
                                </div>
                                <i className="icon icon-arrow-right"/>
                            </div>
                        </div>);
            break;

            case 'search':
                return (<div className="recipeSearch" onClick={() => this.props.callback(this.state.recipe)}>
                            <div className="recipeSearchInfo">
                                <div className={"recipeCategoryName recipeCategoryName-" + this.state.recipe.idCategory}>{this.state.recipe.categoryName}</div>
                                <div className="recipeSearchName">
                                    <Highlighter highlightClassName="YourHighlightClass"
                                                searchWords={[this.props.search]}
                                                autoEscape={true}
                                                textToHighlight={this.state.recipe.name}/>
                                </div>
                            </div>
                            <i className="icon icon-arrow-right"/>
                        </div>);
            break;

            case 'complete':
                return (<div className="recipeCompleteWrapper">
                            <div className="recipeComplete">
                                <div className="recipeTop">
                                    <div className="recipeTitle">{this.state.recipe.name}</div>
                                    <div className="recipeDescription">{this.state.recipe.description}</div>
                                    {this.renderStars()}
                                    <div className="recipeServings">
                                        <i className="icon icon-serving"/>
                                        <span>{this.state.recipe.servings || '4'} personas</span>
                                    </div>
                                    <div className="recipeTime">
                                        <i className="icon icon-clock"/>
                                        <span>{this.state.recipe.time || '30 minutos'}</span>
                                    </div>
                                </div>
                                <div className="recipeBottom">
                                    <div className="recipeIngredients">
                                        <div className="recipeCompleteTitle">
                                            <i className="icon icon-ingredients"/>
                                            <span>Ingredientes</span>
                                        </div>
                                        <div className="recipeInfo" dangerouslySetInnerHTML={{__html: this.state.recipe.ingredients}}/>
                                    </div>
                                    <div className="recipePreparation">
                                        <div className="recipeCompleteTitle">
                                            <i className="icon icon-preparation"/>
                                            <span>Preparación</span>
                                        </div>
                                        <div className="recipeInfo" dangerouslySetInnerHTML={{__html: this.state.recipe.preparation}}/>
                                    </div>
                                </div>
                            </div>
                            {this.renderRelated()}
                        </div>);
            break;

        }
        return null;
    }

    renderStars() {
        return (<div className="stars">
                    {[1, 2, 3, 4, 5].map((item) => <div className="star" key={"star-" + item + "-" + this.state.recipe.idRecipe}>
                                                        <i className={"icon icon-" + ((item <= (this.state.recipe.rating * 1)) ? 'star-full' : 'star-empty')}/>
                                                    </div>)}
                </div>);
    }

    renderRelated() {
        return (<div className="related">
                    <div className="relatedTitle">Otras recetas</div>
                    <div className="relatedItems">
                        {db.recipes.filter(item => item.idCategory==this.state.recipe.idCategory)
                                                .map((item) => <RecipeUi recipe={item} key={"recipe-" + item.idRecipe} callback={this.props.callback}/>)}
                    </div>
                </div>);
    }

}

export default RecipeUi;
