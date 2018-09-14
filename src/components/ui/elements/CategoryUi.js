'use strict';

import React from 'react';
import db from '../../../db/db.json';

class CategoryUi extends React.Component {

    constructor(props) {
        super(props);
        this.state = {category: this.props.category,
                        layout: this.props.layout};
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.layout != this.state.layout) {
            this.setState({layout: nextProps.layout});
        }
        if (nextProps.category && nextProps.category.idCategory != this.state.category.idCategory) {
            this.setState({category: nextProps.category});
        }
    }

    render() {
        const { t } = this.props;
        switch (this.state.layout) {

            default:
                return (<div className={"category category-" + this.state.category.idCategory} onClick={() => this.props.callback(this.state.category)}>
                            <span>{this.state.category.name}</span>
                        </div>);
            break;

            case 'intro':
                return (<div className={"categoryIntro categoryIntro-" + this.state.category.idCategory} onClick={() => this.props.callback(this.state.category)}>
                            <div className="categoryIntroName">{this.state.category.name}</div>
                            <div className="categoryIntroRecipes">
                                <strong>{db.recipes.filter(item => item.idCategory==this.state.category.idCategory).length}</strong>
                                <span>recetas</span>
                            </div>
                        </div>);
            break;

        }
        return null;
    }

}

export default CategoryUi;
