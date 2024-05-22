import { cloneElement, Children } from 'react';
import Grid from './Grid';
import { staggerContainer, staggerItem } from './Stagger';

export const StaggerGrid = ({ children, ...props }: any) => {
  return (
    <Grid {...staggerContainer('y', 1.5)} {...props}>
      {Children.map(children, child => {
        return cloneElement(child, staggerItem());
      })}
    </Grid>
  );
};
