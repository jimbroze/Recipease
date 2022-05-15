import React from "react";
import { useSelector } from "react-redux";
import { Item, Header } from "semantic-ui-react";

import { ingredientsSelectors } from "./currentRecipeSlice";

const Ingredient = (props) => {
  const ingredient = useSelector((state) =>
    ingredientsSelectors.selectById(state, props.id)
  );

  const ingredientText = (ingredient || { text: "" }).text;

  // Content can be replace. e.g for editing
  const content = props.altContent || (
    <Header as="p" size="small" onClick={props.onClick}>
      {ingredientText}
    </Header>
  );

  // For mini ingredients on steps try labels:
  // <div class="extra">
  //       <div class="ui label">IMAX</div>
  //       <div class="ui label"><i class="globe icon"></i> Additional Languages</div>
  //     </div>

  return (
    <>
      {React.Children.map(props.children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { ...props });
        }
        return child;
      })}
      <Item.Content>{content}</Item.Content>
    </>
  );
};

export default Ingredient;
