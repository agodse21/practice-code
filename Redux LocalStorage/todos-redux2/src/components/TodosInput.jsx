import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Center, Flex, Heading, Icon, IconButton, Input, Spacer } from "@chakra-ui/react";
import { useState } from "react";

function TodosInput({addTodo}){
    const [text,setText]=useState("");
    const handleAdd=()=>{
        if(text){
            addTodo(text);
            setText("")
        }
    }
return(<>
<Box mt={5} border="2px solid black" borderRadius={10}><Center>
    <Heading mt={5} mb={5} size="md" >Add Todos </Heading>
    </Center>
<Flex alignItems="center" p="10px" >

    <Input  border="2px solid black" w="80%" color='green' focusBorderColor='green.400' value={text} onChange={(e)=>setText(e.target.value)} type="text" />
    <Spacer />
    <IconButton onClick={handleAdd} w="15%" colorScheme='green' >
    {<AddIcon />}
  </IconButton>
   
    </Flex>
    </Box>
    </>
)
}
export default TodosInput;