import React from "react";
import { useSelector } from "react-redux";

import { Grid, Item, Segment, Header } from "semantic-ui-react";

import { stepsSelectors } from "./currentRecipeSlice";
import Ingredients from "./Ingredients";
import Instruction from "./Instruction";

const Step = ({ id, index, ReplacementIngredient, ReplacementInstruction }) => {
  const step = useSelector((state) => stepsSelectors.selectById(state, id));

  const IngredientsComp = ReplacementIngredient || Ingredients;
  const InstructionComp = ReplacementInstruction || Instruction;

  return (
    <Item>
      <Item.Content>
        <Segment>
          <Header>Step {index + 1}</Header>
          <Grid columns="equal">
            <Grid.Column>
              <IngredientsComp ingredientIds={step.ingredients} stepId={id} />
            </Grid.Column>
            <Grid.Column>
              <InstructionComp text={step.text} id={id} />
            </Grid.Column>
          </Grid>
        </Segment>
      </Item.Content>
    </Item>
  );
};

export default Step;
