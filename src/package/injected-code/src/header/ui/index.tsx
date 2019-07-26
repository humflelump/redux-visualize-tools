import React from 'react';
import { State } from '../../store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withStyles, createStyles } from '@material-ui/styles';
import { WithStyles, Theme, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

const mapStateToProps = (state: State) => {
    return {

    };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {

    }
};

const styles = (theme: Theme) => createStyles({
    container: {
        position: 'absolute',
        left: 0,
        width: 48,
        height: 48,
        top: 0,
        borderRadius: 24,
        backgroundColor: 'rgb(255, 255, 255, 0.7)',
    },
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps =  ReturnType<typeof mapDispatchToProps>;
interface StyleProps extends WithStyles<typeof styles> {};
export interface PassedProps {};
type Props = StateProps & DispatchProps & StyleProps & PassedProps

class Component extends React.Component<Props> {
    render() {
        const props = this.props;

        return <div 
            className={props.classes.container}
        >
            <IconButton aria-label="Delete">
                <MenuIcon />
            </IconButton>
        </div>
    }
}

export const HeaderComponent = connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(Component)) as React.ComponentClass<PassedProps>;