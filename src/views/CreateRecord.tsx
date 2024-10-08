import { Button, Col, Container, Form, FormGroup, FormSelect, Row, Spinner } from "react-bootstrap";
import { v4 } from "uuid";
import { useBaby, useProject, useVideoDevice } from "../hooks";
import { useCallback, useEffect, useState } from "react";
import { tBaby, tMovs, tProject } from "../interfaces";
import { SelectCamsModal } from "../components";
import { LayoutRecording } from "../layouts";

export default function CreateRecord() {
    //HOOKS
    const { readBabys, cancelProcess: cancelBabyProcess } = useBaby();
    const { readProjects, cancelProcess: cancelProjectProcess } = useProject();
    const { getVideoStreams, loadingStreams } = useVideoDevice();

    //STATES
    const [babys, setBabys] = useState<tBaby[]>([]);
    const [projects, setProjects] = useState<tProject[]>([]);

    const [videoStreams, setVideoStreams] = useState<MediaStream[]>([]);
    const [selectedVideoStreams, setSelectedVideoStreams] = useState<{ stream: MediaStream; label: string }[]>([]);

    const [showSelectCamsModal, setShowSelectCamsModal] = useState(false);

    //EVENTS
    const removeStreams = useCallback(() => {
        if (videoStreams.length < 1) return;
        videoStreams.forEach((stream) => {
            stream.getTracks().forEach((track) => {
                track.stop();
                stream?.removeTrack(track);
            });
        });
    }, [videoStreams]);

    useEffect(() => {
        readBabys()
            .then((babys) => setBabys(babys))
            .catch((err) => console.error(err));

        readProjects()
            .then((projects) => setProjects(projects))
            .catch((err) => console.error(err));

        return () => {
            cancelBabyProcess();
            cancelProjectProcess();
            removeStreams();
        };
    }, [cancelBabyProcess, readBabys, readProjects, cancelProjectProcess, removeStreams]);

    const findStreams = useCallback(async () => {
        try {
            const streams = await getVideoStreams();
            setVideoStreams(streams);
            setShowSelectCamsModal(true);
        } catch (err) {
            console.error(err);
        }
    }, [getVideoStreams]);

    const handleOnHideSelectCamsModal = useCallback(() => {
        removeStreams();
        setShowSelectCamsModal(false);
    }, [removeStreams]);

    return (
        <Container fluid className="h-100">
            <Row className="h-100">
                <FormGroup sm="6" md="4" lg="3" xl="2" as={Col} controlId={v4()} className="mb-2">
                    <Form.Label>Bebê</Form.Label>
                    <FormSelect className="rounded-pill">
                        <option value="">--- Selecionar bebê ---</option>
                        {babys.map((baby) => (
                            <option key={baby.id_baby} value={baby.id_baby}>
                                {baby.name}
                            </option>
                        ))}
                    </FormSelect>
                </FormGroup>

                <FormGroup as={Col} sm="6" md="4" lg="3" xl="2" controlId={v4()} className="mb-2">
                    <Form.Label>Projeto</Form.Label>
                    <FormSelect className="rounded-pill">
                        <option value="">--- Selecionar projeto ---</option>
                        {projects.map((project) => (
                            <option key={project.id_proj} value={project.id_proj}>
                                {project.name_proj}
                            </option>
                        ))}
                    </FormSelect>
                </FormGroup>

                <Col className="d-flex align-items-end mb-2">
                    <Button className="rounded-pill" onClick={findStreams}>
                        {loadingStreams ? (
                            <Spinner className="me-2" size="sm" animation="grow" />
                        ) : (
                            <i className="bi bi-camera-fill me-2" />
                        )}
                        Escolher câmeras
                    </Button>
                </Col>

                <Col sm="12" className="h-100 p-0 z-1 mb-2 border-top">
                    <LayoutRecording videos={selectedVideoStreams} moviments={moviments} />
                </Col>
            </Row>

            <SelectCamsModal
                show={showSelectCamsModal}
                onHide={handleOnHideSelectCamsModal}
                videoStreams={videoStreams}
                onConfirm={(selected) => {
                    setSelectedVideoStreams(selected);
                    setShowSelectCamsModal(false);
                }}
            />
        </Container>
    );
}

const moviments: tMovs[] = [
    { id_mov: 0, description: "Movimento 1" },
    { id_mov: 1, description: "Movimento 2" },
    { id_mov: 2, description: "Movimento 3" },
    { id_mov: 3, description: "Movimento 4" },
];
