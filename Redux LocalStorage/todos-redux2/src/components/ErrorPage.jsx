import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Center, CloseButton, Heading, useDisclosure } from "@chakra-ui/react";
import { Link } from "react-router-dom";

function ErrorPage(){
    // const {
    //     isOpen: isVisible,
    //     onClose,
    //     onOpen,
    //   } = useDisclosure({ defaultIsOpen: true })
    
    return(
        <Box>
            {
            (
                    <Alert mt={5} status='error'>
                      <AlertIcon />
                      <Box>
                        <AlertTitle> 404 error </AlertTitle>
                        <AlertDescription>
                         <Heading>
                          Page Not Found!
                         </Heading>
                        </AlertDescription>
                      </Box>
                    </Alert>
                  ) 
            }

<Center><Link to="/"> <Button mt={5} colorScheme='teal' variant='outline'>Go Home</Button></Link></Center>
     
        </Box>
    )
}


export default ErrorPage;