import React, { Component } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Button } from 'react-native'
import PropTypes from "prop-types";


class SortDown extends Component {
    constructor(props) {
        super(props);
    }
    static propTypes = {
        isSortDown: PropTypes.bool.isRequired,
        toggleSortDown: PropTypes.func.isRequired
    };
    render() {
        const { isSortDown } = this.props;
        return (
            <Button title="적용됨" onPress={this._toggle}></Button>
        
            
        );
    }
    _toggle = (event) => {
        event.stopPropagation();
        const { toggleSortDown } = this.props;
        toggleSortDown();
    }
}



const styles = StyleSheet.create({
    container: {
        marginLeft: 20,
        marginRight: 20,
    },
    input: {
        borderRadius: 10,
        backgroundColor: "#FFF",
        paddingLeft: 10,
        paddingRight: 10,
        height: 50,
        alignItems: "center",
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: "#bbb",
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    inputText: {
        flex: 1,
    },
    addBtn: {
        color: '#4169E1'
    }
});

export default SortDown;