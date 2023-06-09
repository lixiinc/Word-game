import { useEffect, useState} from 'react';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { colors, CLEAR, ENTER } from "../../constants";
import Keyboard from '../Keyboard';
import words from '../../wordlist';


const NUMBER_OF_TRIES = 6;

const copyArray = (arr) => {
  return [...arr.map((rows) =>[...rows])];
};

const getDayOfTheYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  return day;
};

 const dayOfTheYear = getDayOfTheYear();

const Game = () => {
  const word = words[dayOfTheYear];
  const letters = word.split("");

  const [rows, setRows] = useState(
    new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(""))
  );

  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);
  const [gameState, setGameState] = useState('playing');

  useEffect(() =>{
    if (curRow > 0){
      checkGameState();
    }
  }, [curRow]);

  const checkGameState = () =>{
    if(checkIfWon()){
      Alert.alert("Hurray","You won!");
      setGameState('won');
    } else if(checkIfLost()) {
      Alert.alert("Oops","Try again tomorrow!");
      setGameState('lost');
    }
  };

  const checkIfWon = () =>{
    const row = rows[curRow -1];

    return row.every((letter,i) => letter ===letters[i])
  };

  const checkIfLost = () =>{
    return curRow === rows.length;
  };
  
  const onKeyPressed = (key) => {
    if (gameState !== 'playing'){
      return;
    }

    const updatedRows = copyArray(rows);

    if(key === CLEAR){
      const prevCol = curCol - 1;
      if(prevCol >= 0){
        updatedRows[curRow][prevCol] = "";
        setRows(updatedRows);
        setCurCol(prevCol);
      }
      return;
    }

    if(key === ENTER){
      if (curCol === rows[0].length){  //To ensure user fills up all 5 grids before able to hit enter
        setCurRow(curRow + 1);
        setCurCol(0);
      }

      return;
    }

    if (curCol < rows[0].length) {
    updatedRows[curRow][curCol] = key;
    setRows(updatedRows);
    setCurCol(curCol + 1);
    }
  };

  const isCellActive = (row, col) => {
    return row === curRow && col === curCol;
  };

  const getCellBGColor =(row, col) => {
    const letter = rows[row][col];
    if(row >= curRow){
      return colors.black;
    }
    if(letter === letters[col]){
      return colors.primary;
    }
    if(letters.includes(letter)) {
      return colors.secondary;
    }
    return colors.red;
  };

  const getAllLetterWithColor = (color) =>{
    return rows.flatMap((row,i) => 
      row.filter((cell ,j)=> getCellBGColor(i, j) === color)
    );
  }

  const greenCaps = getAllLetterWithColor(colors.primary);
  const yellowCaps = getAllLetterWithColor(colors.secondary);
  const redCaps =  getAllLetterWithColor(colors.red);
 

  return (
    <>
        <ScrollView style={styles.map}>
        {rows.map((row, i) => (
            <View key={`row-${i}`} style={styles.row}>
            {row.map((letter, j) => (
                <View 
                key={`cell-${i}-${j}`}
                style={[
                    styles.cell,
                    {
                    borderColor: isCellActive(i, j)
                        ? colors.lightgrey
                        : colors.darkgrey,
                    backgroundColor: getCellBGColor(i, j),
                    },
                ]}
                >
                <Text style={styles.cellText}>{letter .toUpperCase()}</Text>
                </View>
            ))}
            </View>
        ))}
        </ScrollView>


        <Keyboard 
        onKeyPressed={onKeyPressed} 
        greenCaps={greenCaps} 
        yellowCaps={yellowCaps}
        redCaps={redCaps}
        />
    </>
  );
}

const styles = StyleSheet.create({

  map:{
    alignSelf:'stretch',
    marginVertical:20,
    height: 100,
  },
  row: {
    
    alignSelf:"stretch",
    flexDirection:'row',
    justifyContent:"center",

  },
  cell: {
    borderWidth:3,
    borderColor: colors.darkgrey,
    flex: 1,
    maxWidth: 60,
    aspectRatio: 1,
    margin: 3,
    justifyContent:"center",
    alignItems: "center",

  },
  cellText:{
    color: colors.lightgrey,
    fontWeight:"bold",
    fontSize: 28,

  }
});

export default Game;