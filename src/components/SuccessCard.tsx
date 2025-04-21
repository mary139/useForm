import { Button, Card } from "@chakra-ui/react"
import { Check } from "lucide-react";

const SuccessCard = ({ handleReset }) => {

    return (
        <Card.Root bgColor={'white'} color={'black'} justifyContent={'center'} alignItems={'center'}>
            <Card.Header justifyContent={'center'}>
                <Check className="h-6 w-6 text-green-600" />
            </Card.Header>
            <Card.Body >
                <div className="text-center">Registration Successful</div>
                <div className="text-center">
                    Your account has been created successfully!
                </div>
            </Card.Body>
            <Card.Footer >
                <Button
                    variant={'outline'}
                    onClick={handleReset}
                    className="w-full"
                >
                    Register Another User
                </Button>
            </Card.Footer>
        </Card.Root>
    );
};

export default SuccessCard;