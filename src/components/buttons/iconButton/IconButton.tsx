import { Button, ButtonProps, Spinner } from "react-bootstrap";
import { useCallback, useState } from "react";
import "./styles.css";

export interface IconButtonProps extends ButtonProps {
    bootstrapIconName: string;
    text?: string;
    onClickAsync?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
}

export default function IconButton({ bootstrapIconName, text, onClickAsync, onClick, ...rest }: IconButtonProps) {
    //STATES
    const [loading, setLoading] = useState(false);

    //EVENTS
    const handleOnClick = useCallback(
        async (e: React.MouseEvent<HTMLButtonElement>) => {
            if (onClickAsync) {
                setLoading(true);
                onClickAsync(e).finally(() => setLoading(false));
            } else if (onClick) onClick(e);
        },
        [onClickAsync, onClick]
    );

    return (
        <Button
            {...rest}
            onClick={handleOnClick}
            variant="transparent"
            className={rest.className + " my-icon-button p-1 d-flex align-items-center justify-content-center"}
        >
            {loading ? (
                <Spinner size="sm" animation="grow" />
            ) : (
                <span>
                    {text}
                    <i className={`bi bi-${bootstrapIconName} ${rest.size === "lg" ? "fs-5" : "fs-6"}`} />
                </span>
            )}
        </Button>
    );
}
