import './App.css';
import './Styles';
import { ImgstryEditor } from './containers/ImgstryEditor';
import { ThemeProvider } from '@rmwc/theme';
import React from 'react';

function App() {
    return (
        <ThemeProvider
            options={{
                primary: '#f2a62e',
                secondary: '#009ac0',
            }}
            className={'imgstry-container'}
        >
            <ImgstryEditor src="https://i.imgur.com/Ht8sj8f.jpg" />
        </ThemeProvider>
    );
}

export default App;
