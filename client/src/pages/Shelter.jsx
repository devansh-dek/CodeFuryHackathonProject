import { currentShelterAtom } from "@/store/currentShelter";
import {
    GoogleMap,
    MarkerF,
    useLoadScript,
} from "@react-google-maps/api";
import { useState, useMemo, useEffect } from "react";
import { useRecoilValue } from "recoil";
import axios from "axios";
import { ArrowBigLeft, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import userState from "@/recoil/atoms/userState";
import { useToast } from "@/components/ui/use-toast";

function Shelter() {
    const { toast } = useToast();

    const currentShelter = useRecoilValue(currentShelterAtom);
    const user = useRecoilValue(userState);
    console.log(user);
    console.log(user, "is our user");
    let orgs = [];
    let users = [];
    let orgnames = [];

    if (currentShelter.organizations.length > 0) {
        orgs = currentShelter.organizations.map((org) => {
            return { name: org.orgId.orgname, people: org.peopleCount };
        });
        orgnames = currentShelter.organizations.map((org) => {
            return (org.orgId.orgname);
        });
    }
    if (currentShelter.users.length > 0) {
        users = currentShelter.users.map((user) => {
            return (user.username);
        });
    }

    const [isVolunteerButton, setIsVolunteerButton] = useState((user.role == 'user' && !users.includes(user.username)) || (currentShelter.progress == 'Unclaimed' && user.role == 'org'))

    async function addUserToShelter() {
        try {
            const payload = {
                shelterId: currentShelter._id,
                userId: user.userId,
            }
            console.log(currentShelter._id, user.userId);
            const res = axios.post('http://localhost:3000/api/v1/shelter/join-as-user', payload);
            console.log(res.data);
            setIsVolunteerButton(false);
            toast({
                title: "Added individual to shelter",
            });
        } catch (error) {
            console.error(error);
        }
    }

    const [map, setMap] = useState(null);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyAPaxWzHdEchDySEbDuhlwlW4KcoorTevY",
    });

    const center = useMemo(() => ({ lat: currentShelter.latitude, lng: currentShelter.longitude }), [currentShelter.latitude, currentShelter.longitude]);

    return (
        <div className="bg-zinc-100 min-h-full w-full">
            <Link to="/"><div className="px-10 text-xl mt-5 underline flex gap-3 items-center cursor-pointer"><ArrowLeft />Go Back</div></Link>
            <div className="flex gap-10 m-10">
                <div className="basis-2/3 flex flex-col justify-between">
                    <div className="bg-white rounded-lg shadow-xl p-5">
                        <div className="text-3xl font-semibold mb-5">Details</div>
                        <div className="flex flex-wrap mb-5">
                            <div className="basis-1/2">
                                <div className="text-xl font-semibold text-zinc-500">Name</div>
                                <div className="text-lg mb-5 font-semibold">{currentShelter.name}</div>
                            </div>
                            <div className="basis-1/2">
                                <div className="text-xl font-semibold text-zinc-500">Description</div>
                                <div className="text-lg mb-5 font-semibold">{currentShelter.description}</div>
                            </div>
                            <div className="basis-1/2">
                                <div className="text-xl font-semibold text-zinc-500 mb-2">Disaster Type</div>
                                <div className="text-lg mb-5 font-semibold bg-cyan-500 text-white w-fit px-5 rounded-full py-1">{currentShelter.disasterType}</div>
                            </div>
                            <div className="basis-1/2">
                                <div className="text-xl font-semibold text-zinc-500">Status</div>
                                <div className="text-lg mb-5 font-semibold">{currentShelter.progress}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-5 shadow-xl rounded-lg">
                        <div className="text-3xl font-semibold mb-5 flex justify-between items-center">
                            Volunteers
                            {user.role == 'user' && isVolunteerButton ?
                                (
                                    <Button className="rounded-xl" onClick={addUserToShelter}>Volunteer to this shelter as an individual</Button>
                                ) : currentShelter.progress == 'Unclaimed' && user.role == 'org' && isVolunteerButton ?
                                    (
                                        <Popover>
                                            <PopoverTrigger><Button className="rounded-xl">Volunteer to this shelter as an org</Button></PopoverTrigger>
                                            <PopoverContent>
                                                <Label htmlFor="count">People Count</Label>
                                                <Input
                                                    id="count"
                                                    defaultValue="1"
                                                    className="mt-5"
                                                />
                                                <Button className="mt-5">Submit</Button>
                                            </PopoverContent>
                                        </Popover>
                                    ) : ''
                            }
                        </div>
                        <div className="flex pb-5">
                            <div className="basis-1/2">
                                <div className="text-xl font-semibold text-zinc-500 mb-2">Organizations</div>
                                <div>
                                    {orgs.length == 0 ? <div className="text-lg font-semibold">Currently no organizations involved</div> : orgs.map((org) => {
                                        return (
                                            <div className="flex justify-start gap-5 items-center">
                                                <div className="text-lg font-semibold">{org.name}</div>
                                                <div className="text-md bg-zinc-600 text-white rounded-full w-fit py-1 px-3 font-bold">{org.people}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="basis-1/2">
                                <div className="text-xl font-semibold text-zinc-500 mb-2">Individuals</div>
                                <div>
                                    {users.length == 0 ? <div className="text-lg font-semibold">Currently no individial volunteers</div> : users.map((user) => {
                                        return (
                                            <div className="text-lg font-semibold">{user}</div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="basis-1/3 bg-white p-5 h-[500px] rounded-lg shadow-xl">
                    <div className="text-3xl font-semibold mb-5">Location</div>
                    {!isLoaded ? (<div>Loading ....</div>) :
                        (<GoogleMap
                            mapContainerStyle={{ height: "80%", width: "100%", borderRadius: "10px" }}
                            center={center}
                            zoom={8}
                            onLoad={(map) => setMap(map)}
                        >
                            <MarkerF
                                title={`${currentShelter.name} ${currentShelter.description}`}
                                position={{ lat: currentShelter.latitude, lng: currentShelter.longitude }}
                            />
                        </GoogleMap>)
                    }
                </div>
            </div>
        </div>
    )
}

export default Shelter